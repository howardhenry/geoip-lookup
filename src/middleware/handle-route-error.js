const logger = require('../utils/logger');
const responseManager = require('../utils/response-manager');

const handleRouteError = () => {
    return (err, req, res, next) => {
        if (err) {
            logger.error(err.stack);
            responseManager.handleError(res, 500, null, 'GATEWAY');
        } else {
            next();
        }
    };
};

module.exports = handleRouteError;
