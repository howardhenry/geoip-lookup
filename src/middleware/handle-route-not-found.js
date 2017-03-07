const responseManager = require('../utils/response-manager');

const handleRouteNotFound = () => {
    return (req, res) => {
        responseManager.handleError(res, 404, null, 'GATEWAY');
    };
};

module.exports = handleRouteNotFound;
