const path = require('path');
const { Logger, transports } = require('winston');
const callsite = require('callsite');
const chalk = require('chalk');
const _ = require('lodash');
const configUtils = require('./config');

const IS_PRODUCTION = configUtils.getEnv() === 'production';

const logger = new Logger({
    transports: [
        new transports.Console({
            prettyPrint: true,
            stringify: true,
            json: IS_PRODUCTION,
            humanReadableUnhandledException: true,
            level: configUtils.getSetting('app.debug') === true ? 'debug' : 'info'
        })
    ]
});

const handleDevLogs = (level, message, context) => {
    const color = { debug: 'cyan', info: 'white', warn: 'yellow', error: 'red' };
    logger[level](chalk[color[level]](message), chalk.gray(`> ${context}`));
};

// istanbul ignore next
const handleProdLogs = (level, message, context) => {
    const type = 'application';
    const timestamp = (new Date()).toISOString();
    logger[level]({ type, timestamp, message, context });
};

// istanbul ignore next
const getLogContext = (site) => {
    const excludeSysFilepath = path.join(__dirname, '../../');
    let fileName = _.isString(site.getFileName()) ? site.getFileName() : '';
    fileName = fileName.replace(excludeSysFilepath, '');

    const functionName = _.isString(site.getFunctionName()) ?
        `${site.getFunctionName().replace(/.then/g, '').replace(/.catch/g, '')}` : 'anonymous';

    return `${fileName}#${functionName}, ln ${site.getLineNumber()}`;
};

// istanbul ignore next
exports.logMessage = (level, msg) => {
    const site = _.get(callsite(), [2]);
    const context = getLogContext(site);
    let enhancedMsg = msg;

    if (msg instanceof Error) {
        enhancedMsg = msg.toString();
    } else if (_.isPlainObject(msg) || _.isArray(msg)) {
        enhancedMsg = JSON.stringify(msg);
    }

    if (IS_PRODUCTION) {
        handleProdLogs(level, enhancedMsg, context);
    } else {
        handleDevLogs(level, enhancedMsg, context);
    }
};

exports.debug = (msg) => exports.logMessage('debug', msg);

exports.info = (msg) => exports.logMessage('info', msg);

exports.warn = (msg) => exports.logMessage('warn', msg);

exports.error = (msg) => exports.logMessage('error', msg);
