import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const session = require('express-session');
import cors from 'cors';
const Auth0Strategy = require('passport-auth0');
export const passport = require('passport');
import bodyParser from 'body-parser';
import {createIoConnection} from "./websockets";

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const sess = {
    secret: process.env.AUTH_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true
};

const DOMAIN = process.env.DOMAIN;

const strategy = new Auth0Strategy({
        domain: process.env.AUTH_DOMAIN,
        clientID: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_SECRET, // Replace this with the client secret for your app
        callbackURL: DOMAIN + '/callback'
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);


passport.use(strategy);

export const app = express();
app.use(cors());
app.use(session(sess));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(passport.session());

export const server = require('http').createServer(app);

const port = process.env.PORT || 3000

export function startServer() {

    createIoConnection();

    server.listen(port, () => {
        console.log(`Started server on port ${port}`)
    });
}

export const io = require('socket.io')(server);