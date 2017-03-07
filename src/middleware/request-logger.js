const { transports, Logger } = require('winston');
const onFinished = require('on-finished');
const _ = require('lodash');
const configUtils = require('../utils/config');

const IS_PRODUCTION = configUtils.getEnv() === 'production';

const logger = new Logger({
    transports: [
        new transports.Console({
            stringify: true,
            json: IS_PRODUCTION,
            level: configUtils.getSetting('app.debug') === true ? 'debug' : 'info'
        })
    ]
});

const requestLogger = () => {
    return (req, res, next) => {
        const startTime = process.hrtime();
        const timestamp = (new Date()).toISOString();
        const type = 'request';
        const url = req.url;
        const method = req.method;

        // istanbul ignore next
        onFinished(res, () => {
            const responseTime = `${Math.floor(process.hrtime(startTime)[1] / 1000000)}ms`;
            const status = res.statusCode;
            const user = req.user || {};
            user.ip = _.get(req, 'headers.X-Forwarded-For') || _.get(req, 'connection.remoteAddress');

            if (IS_PRODUCTION) {
                const level = req.originalUrl === '/healthy' ? 'debug' : 'info';
                logger[level]({ type, timestamp, status, method, url, responseTime, user });
            } else {
                logger.info(`${timestamp} ${status} ${method} ${url} ${responseTime}`);
            }
        });

        next();
    };
};

module.exports = requestLogger;
