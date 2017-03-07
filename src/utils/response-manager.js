const _ = require('lodash');
const logger = require('./logger');

const handleSuccess = (res, status, data = null) => {
    let statusCode = status;
    let statusText;

    switch (statusCode) {
        case 200:
            statusText = 'SUCCESS';
            break;

        case 201:
            statusText = 'CREATED';
            break;

        case 204:
            statusText = 'NO_CONTENT';
            break;

        default:
            statusCode = 200;
            statusText = 'SUCCESS';
            break;
    }

    const payload = _.isObject(data) ? data : { statusCode, statusText };
    res.status(statusCode).json(payload).end();
};

const handleRedirect = (res, statusCode, url) => {
    res.redirect(statusCode, url);
};

const handleError = (res, status, message, applicationType) => {
    let statusCode = status;
    let statusText;
    let msg = '';
    let msgPrefix = 'Gateway';

    if (!_.includes(['GATEWAY', 'GOOGLE'], applicationType)) {
        // istanbul ignore next
        // eslint-disable-next-line
        logger.warn(`Invalid value ${applicationType} for response manager application type. Expected GATEWAY or GOOGLE`);
    } else {
        msgPrefix = _.isString(applicationType) ? _.startCase(applicationType.toLowerCase()) : 'Gateway';
    }

    // istanbul ignore next
    if (message instanceof Error) {
        statusCode = 400;
        msg = message.toString();
    }

    switch (statusCode) {
        case 400:
            statusText = 'BAD_REQUEST';
            msg = message || 'The request was malformed or missing a required parameter.';
            break;

        case 401:
            statusText = 'UNAUTHORIZED';
            msg = message || 'The authorization token is invalid.';
            break;

        case 404:
            statusText = 'NOT_FOUND';
            msg = message || 'The requested resource or endpoint was not found.';
            break;

        default:
            statusCode = 500;
            statusText = 'SERVER_ERROR';
            msg = message || 'An unknown error occurred with the request.';
            break;
    }

    const payload = { statusCode, statusText, message: `${msgPrefix}: ${msg}` };
    res.status(statusCode).json(payload).end();
};

module.exports = {
    handleSuccess,
    handleRedirect,
    handleError
};
