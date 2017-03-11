const router = require('express').Router();
const co = require('co');
const _ = require('lodash');
const geoDataUtils = require('../utils/geo-data');
const logger = require('../utils/logger');
const responseManager = require('../utils/response-manager');

router.get('/', co.wrap(function* lookup(req, res) {
    const supportedLangs = ['de', 'en', 'es', 'fr', 'ja', 'pt-BR', 'ru', 'zh-CN'];

    try {
        const ip = _.get(req, 'query.ip');
        const lang = _.get(req, 'query.lang', 'en');
        const verbose = _.get(req, 'query.verbose') === 'true';

        if (!_.includes(supportedLangs, lang)) {
            const msg = `Invalid parameter: 'lang'. Expected value to be one of: ${supportedLangs.join(', ')}`;
            responseManager.handleError(res, 400, msg);
        } else if (!geoDataUtils.isValidIpAddress(ip)) {
            responseManager.handleError(res, 400, `Invalid ip address: ${ip}`);
        } else {
            const options = { lang, verbose };
            const geoData = yield geoDataUtils.lookupGeoData(ip, options);

            responseManager.handleSuccess(res, 200, geoData);
        }
    } catch (err) {
        logger.error(err);
        responseManager.handleError(res, 500);
    }
}));

module.exports = router;
