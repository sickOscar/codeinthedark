import express from 'express';
import * as _ from 'lodash';
import {ensureAdmin, validate} from "./middlewares";
import {CitdEvent, Player, Round} from "./db";
import moment from "moment-timezone";
import assert from "assert";
const { body, validationResult } = require('express-validator');

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();


/*******************************************************************************
 *      ___ _________  ________ _   _    ___  _____ _____ _____ _____ _   _  _____
 *     / _ \|  _  \  \/  |_   _| \ | |  / _ \/  __ \_   _|_   _|  _  | \ | |/  ___|
 *    / /_\ \ | | | .  . | | | |  \| | / /_\ \ /  \/ | |   | | | | | |  \| |\ `--.
 *    |  _  | | | | |\/| | | | | . ` | |  _  | |     | |   | | | | | | . ` | `--. \
 *    | | | | |/ /| |  | |_| |_| |\  | | | | | \__/\ | |  _| |_\ \_/ / |\  |/\__/ /
 *    \_| |_/___/ \_|  |_/\___/\_| \_/ \_| |_/\____/ \_/  \___/ \___/\_| \_/\____/
 *
 *
 *
 ************************************************************************************/
export function createAdminRoutes(io) {

    const router = express.Router();

    router.get('/sockets', ensureLoggedIn, ensureAdmin, async (req, res) => {
        res.json({
            sockets: Object.keys(io.sockets.sockets)
        });
        res.end();
    });

    router.post('/round/start/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {
        const roundId = req.params.roundId;
        await Round.update({id: req.params.roundId}, {
            voting: 0,
            running: 1,
            next: 0,
            receiving_layouts: 0,
            showing_results: 0,
            waiting: 0
        });

        res.status(200);
        res.end();

    });

    router.post('/round/next/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {
        await Round.update({id: req.params.roundId}, {
            voting: 0,
            running: 0,
            next: 1,
            receiving_layouts: 0,
            showing_results: 0,
            waiting: 0
        });

        res.status(200);
        res.end();

    });

    router.post('/round/stop/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {
        await Round.update({id: req.params.roundId}, {
            voting: 0,
            running: 0,
            next: 0,
            receiving_layouts: 0,
            showing_results: 0,
            waiting: 0
        });

        res.status(200);
        res.end();
    });

    router.post('/round/archive/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {
        await Round.update({id: req.params.roundId}, {
            voting: 0,
            running: 0,
            next: 0,
            receiving_layouts: 0,
            showing_results: 0,
            waiting: 0
        });

        res.status(200);
        res.end();
    });

    router.post('/round/startVote/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {
        await Round.update({id: req.params.roundId}, {
            voting: 1,
            running: 0,
            next: 0,
            receiving_layouts: 0,
            showing_results: 0,
            waiting: 0
        });

        res.status(200);
        res.end();
    });

    router.post('/round/showResults/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {

        await Round.update({id: req.params.roundId}, {
            voting: 0,
            running: 0,
            next: 0,
            receiving_layouts: 0,
            showing_results: 1,
            waiting: 0
        });

        res.status(200);
        res.end();
    });

    router.post('/round/receiveLayouts/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {

        await Round.update({id: req.params.roundId}, {
            voting: 0,
            running: 0,
            next: 0,
            receiving_layouts: 1,
            showing_results: 0,
            waiting: 0
        });

        res.status(200);
        res.end();
    });

    router.post('/round/waiting/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {

        await Round.update({id: req.params.roundId}, {
            voting: 0,
            running: 0,
            next: 0,
            receiving_layouts: 0,
            showing_results: 0,
            waiting: 1
        });

        res.status(200);
        res.end();
    });

    router.post('/event/startCountDown', ensureLoggedIn, ensureAdmin, async (req, res) => {

        await CitdEvent.update({running_countdown: 0}, {
            running_countdown: 1
        });

        res.status(200);
        res.end();

    });

    router.post('/event/stopCountDown', ensureLoggedIn, ensureAdmin, async (req, res) => {

        await CitdEvent.update({running_countdown: 1}, {
            running_countdown: 0
        });

        res.status(200);
        res.end();

    });

    router.post('/round',
        ensureLoggedIn,
        ensureAdmin,
        async (req, res) => {

        try {
            const roundPayload = req.body as any;
            
            // VALIDATE PLAYERS
            const addedPlayers:any[] = [];
            roundPayload.players.forEach(p => {
                p && addedPlayers.push(p);
            })
            assert(addedPlayers.length > 0, "must add players");

            assert(roundPayload.name, 'must add name');
            assert(roundPayload.start, 'must add start');
            assert(roundPayload.end, 'must add end');
            assert(roundPayload.vote_start, 'must add vote_start');
            assert(roundPayload.vote_end, 'must add vote_end');
            assert(roundPayload.layout_url, 'must add layout_url');
            assert(roundPayload.instructions_url, 'must add instructions_url');

            console.log(`roundPayload`, roundPayload)

            let players:any[] = [];
            for (let i = 0; i < addedPlayers.length; i++) {
                const p = await Player.findOne({
                    'id': addedPlayers[i]
                });
                players.push(p.toSchema())
            }

            const parseTimeString = (timeString:string) => {
                const [hours, minutes] = timeString.split(':');
                return {hour: parseInt(hours), minute: parseInt(minutes), second: 0, millisecond: 0};
            }

            const roundStart = moment()
                .tz('Europe/Rome')
                .set(parseTimeString(roundPayload.start))
                .toISOString();

            const roundEnd = moment()
                .tz('Europe/Rome')
                .set(parseTimeString(roundPayload.end))
                .toISOString();

            const voteStart = moment()
                .tz('Europe/Rome')
                .set(parseTimeString(roundPayload.vote_start))
                .toISOString();

            const voteEnd = moment()
                .tz('Europe/Rome')
                .set(parseTimeString(roundPayload.vote_end))
                .toISOString();

            const round = {
                name: roundPayload.name,
                layout_url: roundPayload.layout_url,
                players: JSON.stringify(players),
                start: roundStart,
                end: roundEnd,
                vote_start: voteStart,
                vote_end: voteEnd,
                last: roundPayload.last ? 1 : 0,
                instructions_url: roundPayload.instructions_url
            };


            if (!_.isNil(roundPayload.id)) {
                // UPDATE
                await Round.update({id: roundPayload.id}, round);
            } else {
                const r = new Round({
                    ...round,
                    next: 0,
                    running: 0,
                    voting: 0,
                    showing_results: 0,
                    receiving_layouts: 0,
                    waiting: 0,
                });
                await r.save();
            }

            res.status(200);
            res.redirect(`/hippos`);
        } catch (err:any) {
            res.status(500);
            console.log(`err`, err)
            res.end(err.message)
        }


    });


    router.post('/create-player', ensureLoggedIn, ensureAdmin, async (req, res) => {

        const player = {
            name: req.body.name,
            fullname: req.body.fullname
        };

        console.log({player});

        const p = new Player(player);
        await p.save();

        res.status(200);
        res.end('Player created');

    });


    router.delete('/round/:roundId', ensureLoggedIn, ensureAdmin, async (req, res) => {

        await Round.deleteOne({id: req.params.roundId});

        res.status(200);
        res.end('Round deleted');

    });

    router.delete('/player/:playerId', ensureLoggedIn, ensureAdmin, async (req, res) => {

        await Player.deleteOne({id: req.params.playerId});

        res.status(200);
        res.end('Player deleted');

    });


    // router.use((err, req, res, next) => {
    //     console.log('ERROR');
    //     console.log(err)
    //     if (res.headersSent) {
    //         return next(err)
    //     }
    //     res.status(500).send(err.message)
    // });

    return router;
}

/*******************************************************
 *    ______ _____ _   _______ ___________
 *    | ___ \  ___| \ | |  _  \  ___| ___ \
 *    | |_/ / |__ |  \| | | | | |__ | |_/ /
 *    |    /|  __|| . ` | | | |  __||    /
 *    | |\ \| |___| |\  | |/ /| |___| |\ \
 *    \_| \_\____/\_| \_/___/ \____/\_| \_|
 *
 *
 *
 *
 /*******************************************************/
export function createRenderRoutes(io:any) {

    const router = express.Router();

    router.get('/', async (req, res) => {
        res.send('WELCOME')
    });

    router.get('/hippos', ensureLoggedIn, ensureAdmin, async (req, res) => {

        const rounds = (await Round.find())
            .map(r => {
                const s = r.toSchema();
                console.log(`s`, s)
                s.players = JSON.parse(s.players);
                return s;
            });
        const players = (await Player.find()).map(p => p.toSchema());

        res.render('index', {
            title: 'Admin DASHBOARD',
            rounds,
            players
        })

    });

    router.get('/admin/votes/:roundId', ensureAdmin, async (req, res) => {

        res.render('votes', {
            title: 'Votes',
        })

    });

    router.get('/round-form', ensureLoggedIn, ensureAdmin, async (req, res) => {

        const players = (await Player.find()).map(r => r.toSchema());;

        console.log(players);

        res.render('round-form', {
            title: 'Create Round',
            players
        })

    });

    router.get('/round-form/:id', ensureLoggedIn, ensureAdmin, async (req, res) => {

        const players = (await Player.find()).map(r => r.toSchema());
        const round = (await Round.findOne({id: req.params.id})).toSchema()

        const convertToRomeTime = (utcISOString:string) => {

            const newDate = moment(utcISOString).toDate();
            const newTime = moment(newDate).tz('Europe/Rome').format('HH:mm');
            return newTime;

        }

        res.render('round-form', {
            title: 'Create Round',
            players,
            round: {
                ...round,
                players: JSON.parse(round.players),
                end: convertToRomeTime(round.end),
                start: convertToRomeTime(round.start),
                vote_end: convertToRomeTime(round.vote_end),
                vote_start: convertToRomeTime(round.vote_start)
            }
        })

    });

    router.get('/user', ensureLoggedIn, async (req, res) => {
        res.json({
            // @ts-ignore
            user: req.user,
            // @ts-ignore
            userProfile: JSON.stringify(req.user, null, '  ')
        });

    });

    router.get('/player-form', ensureLoggedIn, ensureAdmin, async (req, res) => {

        res.render('player-form', {
            title: 'Create Player'
        })

    });

    return router;
}

