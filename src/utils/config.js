const _ = require('lodash');

// eslint-disable-next-line
let SETTINGS = require('../settings');

const getPort = () => _.get(SETTINGS, 'app.port');

const getEnv = () => _.get(SETTINGS, 'app.environment');

const getSetting = (path) => _.get(SETTINGS, path);

module.exports = {
    getPort,
    getEnv,
    getSetting
};
