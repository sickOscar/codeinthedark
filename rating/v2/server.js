const https  = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');

const ngApp = express();
const app = express();
const ROOT_NG = 'ar-mode';
const ROOT_OLD = 'v1';

ngApp.use(express.static(path.resolve(__dirname, ROOT_NG)));
app.use(express.static(path.resolve(__dirname, ROOT_OLD)));

ngApp.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, ROOT_NG, 'index.html'))
});

const sk = path.resolve(__dirname, 'certs', 'server.key');
const sc = path.resolve(__dirname, 'certs', 'server.cert');

https.createServer({
    key: fs.readFileSync(sk),
    cert: fs.readFileSync(sc)
  }, ngApp).listen(8000, () => {
    console.log('AR CITD vote App is listening on port 8000');
})

https.createServer({
    key: fs.readFileSync(sk),
    cert: fs.readFileSync(sc)
  }, app).listen(8001, () => {
    console.log('Simple CITD vote App is listening on port 8001');
})

