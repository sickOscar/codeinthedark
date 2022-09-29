import express from 'express';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import moment from 'moment';
import * as _ from 'lodash';
import * as Joi from 'joi';
import fs from "fs";
import * as AWS from "aws-sdk";
import {dirname} from 'path';
import {CitdEvent, Feedback, Round, RoundSchema, User, Vote} from "./db";
import assert from "assert";
import sharp from 'sharp';
const os = require("os");


const stripTags = function (str, tags):string {
    const $ = cheerio.load(str);

    if (!tags || tags.length === 0) {
        return str;
    }

    tags = !Array.isArray(tags) ? [tags] : tags;
    let len = tags.length;

    while (len--) {
        $(tags[len]).remove();
    }

    return $.html();
};

/*******************************************************************************
 *      ___  ______ _____ _____
 *     / _ \ | ___ \_   _/  ___|
 *    / /_\ \| |_/ / | | \ `--.
 *    |  _  ||  __/  | |  `--. \
 *    | | | || |    _| |_/\__/ /
 *    \_| |_/\_|    \___/\____/
 *
 *
 *
 *
 ****************************************************************************/
export function createApiRoutes(io) {

    const router = express.Router();

    router.get('/config', async (req, res) => {

        const config = {
            stage: 'dev',
            register: {
                page: '/content/register.html',
                endpoint: '/user'
            },
            feedback: {
                page: '/content/feedback.html',
                endpoint: '/feedback'
            },
            navigation: [
                {
                    label: 'About Us',
                    icon: '/assets/icons/icon_aboutus.png',
                    url: '/content/about.html'
                },
                {
                    label: 'Location',
                    icon: '/assets/icons/icon_location.png',
                    url: '/content/location.html'
                },
                {
                    label: 'Gallery Round',
                    icon: '/assets/icons/icon_gallery.png',
                    url: '/content/gallery.html'
                },
                {
                    label: 'Sponsor',
                    icon: '/assets/icons/icon_sponsor.png',
                    url: '/content/sponsor.html'
                }
            ]
        };

        res.status(200);
        res.json(config);

    });

    router.post('/user', async (req, res) => {

        const user = {
            uuid: req.body.uuid,
            data: req.body
        };

        const u = new User(user);
        await u.save();

        res.status(200);
        res.json({
            message: 'user created'
        });
        res.end()

    });

    router.post('/get-layout', async (req, res) => {
        try {
            const round = await Round.find({
                receiving_layouts: true
            });

            // console.log({round});

            if (round.length === 0) {
                res.status(500);
                res.end("No round receiving");
                return;
            }

            const players = _.cloneDeep(JSON.parse(round[0].schema.players));
            console.log(`players`, players)
            const player = players.find(p => p.name === req.body.player);
            assert(player, `player ${req.body.player} not found`);

            console.log(`GOT PLAYER lAYOUT: ${req.body.player}`);

            const rootDir = os.homedir();
            const dirName = rootDir + '/public/layouts/' + round[0].schema.id;

            if (!fs.existsSync(dirName)) {
                console.log('create dir', dirName);
                fs.mkdirSync(dirName);
            }

            const fileName = dirName + '/' + req.body.player + '.html';

            const width = req.body.width;
            const height = req.body.height;

            const html = stripTags(req.body.html, ['iframe', 'script', 'link']);


            fs.writeFileSync(fileName, html);

            const s3 = new AWS.S3({apiVersion: '2006-03-01'});

            const htmlKey = round[0].schema.name + '/' + req.body.player + '.html';
            const fullPreviewUrlPngKey = round[0].schema.name + '/' + req.body.player + '.png';
            const previewUrlPngKey = round[0].schema.name + '/' + req.body.player + '_small.png';

            const s3HtmlObjectParams = {
                Body: html,
                Bucket: process.env.CITD_BUCKET as string,
                ContentType: 'text/html',
                Key: htmlKey,
                ACL: 'public-read',
            };

            await s3.putObject(s3HtmlObjectParams).promise();

            const bucketUrl = `https://s3.eu-west-1.amazonaws.com/${process.env.CITD_BUCKET}/`;

            const S3HtmlUrl = bucketUrl + htmlKey;

            console.log('S3Url', S3HtmlUrl);

            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    `--window-size=${width},${height}`,
                    '--disable-gpu'
                ]
            });
            const page = await browser.newPage();
            await page.setViewport({width, height});

            // await page.goto('http://localhost:3000' + previewUrl);
            await page.goto(S3HtmlUrl);
            await page.screenshot({
                path: dirName + '/' + req.body.player + '.png',
                clip: {
                    x: 0,
                    y: 0,
                    width: Math.round(width),
                    height: Math.round(height)
                }
            });

            await browser.close();

            await sharp(dirName + '/' + req.body.player + '.png')
                .resize(Math.round(width / 2), Math.round(height / 2))
                .toFile(dirName + '/' + req.body.player + '_small.png');

            const fullPreviewData = fs.readFileSync(dirName + '/' + req.body.player + '.png');

            const s3FullPreviewObjectParams = {
                Body: fullPreviewData,
                Bucket: process.env.CITD_BUCKET as string,
                ContentType: 'image/png',
                Key: fullPreviewUrlPngKey,
                ACL: 'public-read',
            };

            await s3.putObject(s3FullPreviewObjectParams).promise();

            const S3PreviewUrl = bucketUrl + fullPreviewUrlPngKey;

            const smallPreviewData = fs.readFileSync(dirName + '/' + req.body.player + '_small.png');

            const s3SmallPreviewObjectParams = {
                Body: smallPreviewData,
                Bucket: process.env.CITD_BUCKET as string,
                ContentType: 'image/png',
                Key: previewUrlPngKey,
                ACL: 'public-read',
            };

            await s3.putObject(s3SmallPreviewObjectParams).promise();

            const S3SmallPreviewUrl = bucketUrl + fullPreviewUrlPngKey;


            player.full_preview_url = S3PreviewUrl;
            player.preview_url = S3SmallPreviewUrl;

            await Round.update({id: round[0].schema.id}, {
                players: JSON.stringify(players)
            });


            res.status(200);
            res.json({
                status: 'OK',
                redirect: S3PreviewUrl,
                player: req.body.player
            });
            res.end()


        } catch (err) {
            console.error(err);
            res.status(500);
            res.send(err);
            res.end();
        }


    });

    router.post('/feedback', async (req, res) => {


        const feedback = {
            uuid: req.body.uuid,
            data: req.body
        };

        const f = new Feedback(feedback);
        await f.save();

        res.status(200);
        res.json({
            message: 'feedback saved'
        });
        res.end()

    });

    router.get('/round', async (req, res) => {

        const rounds = await Round.find();
        res.json(rounds)

    });

    router.get('/round/:id', async (req, res) => {

        const round = (await Round.findById(req.params.id)).toSchema();

        res.json({
            ...round,
            players: JSON.parse(round.players)
        })

    });

    router.post('/vote/:roundId/:playerId', async (req, res) => {

        const paramsSchema = Joi.object().keys({
            roundId: Joi.string().alphanum().required(),
            playerId: Joi.string().alphanum().required(),
        });

        const {error, value} = paramsSchema.validate(req.params);

        if (error) {
            throw error;
        }

        console.log(req.params.roundId, req.body)

        // CHECK USER
        // let auth0User;
        // try {
        //     auth0User = await getAuth0User(req.body.uuid);
        // } catch (error) {
        //     res.status(500);
        //     res.send({
        //         message: 'Invalid User',
        //     });
        //     res.end();
        //     return;
        // }

        const foundVote = await Vote.find({
            round: req.params.roundId,
            uuid: req.body.uuid
        });

        if (foundVote.length !== 0) {
            res.status(500);
            res.send({
                message: 'Already voted',
            });
            res.end();
            return;
        }

        const vote = new Vote({
            vote_for: req.params.playerId,
            round: req.params.roundId,
            uuid: req.body.uuid,
            voter: ''
        });
        await vote.save();

        // const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_ENDPOINT + '/mine/' + req.body.uuid + '/' + req.params.roundId + '/' + req.params.playerId
        //
        // console.log(BLOCKCHAIN_URL);
        //
        // request(BLOCKCHAIN_URL, (err, resp) => {
        //     console.log('VOTE', req.body.uuid, req.params.roundId, req.params.playerId)
        //     if (err) {
        //         console.log('blockchain fail!!!', JSON.stringify(err))
        //     } else {
        //         console.log('BLOCKCHAINED!!!')
        //     }
        //
        // });

        res.send({
            message: 'Vote OK'
        });
        res.status(200);
        res.end()

    });

    router.get('/vote/:roundId/:uuid', async (req, res) => {


        const foundVote = await Vote.find({
            round: req.params.roundId,
            uuid: req.params.uuid
        });

        if (foundVote.length !== 0) {
            res.status(200);
            res.send(foundVote[0]);
            res.end();
            return;
        }

        res.status(200);
        res.send({});
        res.end();


    });

    router.get('/vote/:roundId', async (req, res) => {

        const schema = Joi.object().keys({
            roundId: Joi.string().alphanum().required()
        });

        const {error, value} = schema.validate(req.params);

        if (error) {
            throw error;
        }

        const votes = await Vote.find({
            round: req.params.roundId
        });
        const round = await Round.findById(req.params.roundId);
        console.log({round});
        const players = JSON.parse(round.schema.players);

        console.log({players});

        const groupedVotes = _.groupBy(votes, vote => vote.schema.vote_for);


        const g = players.map(player => {
            return {
                id: player.id,
                name: player.name,
                votes: groupedVotes[player.id] ? groupedVotes[player.id].length : 0,
                preview_url: JSON.parse(round.schema.players).find(p => p.id === player.id).full_preview_url
            };
        });

        const results = _.sortBy(g, v => v.votes).reverse();

        res.json(results)
    });




    return router;
}

