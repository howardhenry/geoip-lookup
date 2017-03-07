const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const methodOverride = require('method-override');
const compression = require('compression');
const responseTime = require('response-time');
const gunzip = require('gunzip-maybe');
const request = require('request');
const bodyParserExtended = require('./middleware/body-parser-extended');
const handleRouteError = require('./middleware/handle-route-error');
const handleRouteNotFound = require('./middleware/handle-route-not-found');
const healthCheckRouteHandler = require('./route-handlers/health-check');
const configUtils = require('./utils/config');
const logger = require('./utils/logger');
const requestUtils = require('./utils/request');
// require('./validate-app-environment')();
require('./promisify-dependencies');

const app = express();

/**
 * Middleware
 */
app.use(helmet());
app.use(bodyParserExtended.json().unless({ custom: requestUtils.isMultipart }));
app.use(bodyParserExtended.urlEncoded({ extended: true }).unless({ custom: requestUtils.isMultipart }));
app.use(methodOverride());
app.use(compression());
app.use(responseTime());
app.use(handleRouteError());

/**
 * Route handlers
 */
app.use('/healthy', healthCheckRouteHandler);

/**
 * 404 Handler
 * IMPORTANT: Must be positioned after all other routes
 */
app.use(handleRouteNotFound());

let checksum = null;

request.getAsync('http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.md5')
    .then((response) => {
        checksum = response.body;
        console.log(checksum);
    });

const filePath = path.join(__dirname, '../db/maxmind.mmdb');
request
    .get('http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz')
    .pipe(gunzip())
    .pipe(fs.createWriteStream(filePath));

/**
 * Start app
 */
const port = configUtils.getPort();

module.exports = app;
module.exports.server = app.listen(port, () => logger.info(`App listening on port ${port}`));
