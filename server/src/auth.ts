import {wrap} from "async-middleware";
import express from "express";
import {passport} from "./server";

const requestPromise = require('request-promise');

/*******************************************************************************
 *      ___  _   _ _____ _   _
 *     / _ \| | | |_   _| | | |
 *    / /_\ \ | | | | | | |_| |
 *    |  _  | | | | | | |  _  |
 *    | | | | |_| | | | | | | |
 *    \_| |_/\___/  \_/ \_| |_/
 *
 *
 ****************************************************************************/

let apiAccessToken = '';

const getAuth0APIToken = function () {
    const options = {
        method: 'POST',
        url: 'https://' + process.env.AUTH_DOMAIN + '/oauth/token',
        headers: {'content-type': 'application/json'},
        body:
            {
                grant_type: 'client_credentials',
                clientid: process.env.AUTH_API_CLIENT_ID,
                client_secret: process.env.AUTH_API_SECRET,
                audience: 'https://' + process.env.AUTH_DOMAIN + '/api/v2/'
            },
        json: true
    };

    requestPromise(options)
        .then(response => {
            apiAccessToken = response.access_token;
            console.log("GOT API ACCESS TOKEN");
        })
        .catch(error => {
            console.log("API ACCESS TOKEN ERROR");
            console.error(error)
        })
};

// setInterval(() => {
//     getAuth0APIToken();
// }, 1000 * 7000);

const getAuth0User = function (id) {

    const options = {
        url: 'https://' + process.env.AUTH_DOMAIN + '/api/v2/users/' + id,
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + apiAccessToken
        },
        json: true
    };

    return requestPromise(options)
};


// getAuth0APIToken();


export function createAuthRoutes() {
    const router = express.Router();

// Perform the login, after login Auth0 will redirect to callback
    router.get('/login',
        passport.authenticate('auth0', {scope: 'openid email profile'}),
        async (req, res) => {
            res.redirect("/");
        }
    );

// Perform the final stage of authentication and redirect to '/user'
    router.get('/callback',
        passport.authenticate('auth0', {
            failureRedirect: '/login'
        }),
        async (req, res) => {
            // @ts-ignore
            if (!req.user) {
                throw new Error('user null');
            }
            res.redirect("/hippos");
        }
    );


// Perform session logout and redirect to homepage
    router.get('/logout', async (req, res) => {
        // @ts-ignore
        console.log(`Logging out ${req.user}`);
        // @ts-ignore
        req.logout();
        res.redirect('/');
    });

    return router;
}

