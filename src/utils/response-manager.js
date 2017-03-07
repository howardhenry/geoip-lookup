const _ = require('lodash');

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

const handleError = (res, status, message) => {
    let statusCode = status;
    let statusText;
    let msg = '';

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

    const payload = { statusCode, statusText, message: msg };
    res.status(statusCode).json(payload).end();
};

module.exports = {
    handleSuccess,
    handleRedirect,
    handleError
};
