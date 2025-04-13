// DayScope Server 1.0.0 - Built by Linus Kang

const path = require('path');
const cors = require('cors');

const express = require('express');
const app = express();

const { logger } = require('./utils/winston');
const log = logger();

const config = require('./config.json');
const static_endpoints = require('./routes/static_endpoints');
const core_api_endpoints = require('./routes/core_apis');

const port = config.hosting.port;
const host = config.hosting.host;
const version = config.debug.version;
const build = config.debug.build;

app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.info(`Request from: ${ip} - ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(static_endpoints);
app.use('/v1', core_api_endpoints);
app.use(cors());
app.use(express.json());
app.use((req, res, next) => { res.status(404).send('404 Not Found'); });
app.use((err, req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.error(`${clientIp} experienced an error: ${err.stack}`);
    res.status(500).send("Internal Server Error. Please try again later.");
});

app.listen(port, host, () => {
    log.info(`DayScope Server [${version} - Build ${build}]`);
    log.info(`DayScope is running! Access via http://${host}:${port}/`);
});