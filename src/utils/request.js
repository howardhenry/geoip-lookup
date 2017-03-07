const _ = require('lodash');
const configUtils = require('./config');

const isMultipart = (req) => {
    const contentTypeHeader = _.get(req, 'headers.content-type');
    return contentTypeHeader && contentTypeHeader.indexOf('multipart') !== -1;
};

const isPublicRoute = (req) => {
    const authCallbackRoute = configUtils.getSetting('app.routes.authCb');
    const publicRoutes = [].concat(configUtils.getSetting('app.routes.public')).concat(authCallbackRoute);

    return _.some(publicRoutes, (route) => req.path.startsWith(route));
};

module.exports = {
    isMultipart,
    isPublicRoute
};
