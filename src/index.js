const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
const responseTime = require('response-time');
const handleRouteError = require('./middleware/handle-route-error');
const handleRouteNotFound = require('./middleware/handle-route-not-found');
const requestLogger = require('./middleware/request-logger');
const healthCheckRouteHandler = require('./route-handlers/health-check');
const geoIpLookupRouteHandler = require('./route-handlers/geoip-lookup');
const configUtils = require('./utils/config');
const logger = require('./utils/logger');
const geoDataUtils = require('./utils/geo-data');
require('./validate-app-environment')();
require('./promisify-dependencies');

const app = express();

/**
 * Middleware
 */
app.use(helmet());
app.use(requestLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(compression());
app.use(responseTime());
app.use(handleRouteError());

/**
 * Route handlers
 */
app.use('/healthy', healthCheckRouteHandler);
app.use('/lookup', geoIpLookupRouteHandler);
if (configUtils.getEnv() !== 'production') {
    app.use('/test-coverage', express.static(path.join(__dirname, '../coverage/lcov-report')));
}

/**
 * 404 Handler
 * IMPORTANT: Must be positioned after all other routes
 */
app.use(handleRouteNotFound());


/**
 * Start app
 */
const port = configUtils.getPort();

/**
 * Initial DB Update schedule
 */
const cronSchedule = '* * * * *';
geoDataUtils.initDbUpdateSchedule(cronSchedule);

module.exports = app;
module.exports.server = app.listen(port, () => logger.info(`App listening on port ${port}`));
