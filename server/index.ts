import dotenv from 'dotenv';

dotenv.config();

import {app, io, startServer} from './src/server';
import {createAdminRoutes, createRenderRoutes} from "./src/admin";
import {createApiRoutes} from "./src/apis";
import express from "express";
import {createAuthRoutes} from "./src/auth";
import {checkRounds} from "./src/round-checker";

app.use(express.static('public'));
app.set('view engine', 'pug');


const adminRoutes = createAdminRoutes(io);
app.use('/', adminRoutes);

const apiRoutes = createApiRoutes(io);
app.use('/', apiRoutes);

const renderRoutes = createRenderRoutes(io);
app.use('/', renderRoutes);

const authRoutes = createAuthRoutes();
app.use('/', authRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something went wrong');
})

startServer()

setInterval(() => {
    checkRounds(io)
        .catch(err => {
            console.log(`ERROR CHECKING ROUNDS`)
            console.log(err)
        })
}, 1000)




