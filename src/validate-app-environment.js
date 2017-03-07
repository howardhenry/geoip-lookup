const _ = require('lodash');
const logger = require('./utils/logger');

const validateAppEnvironment = () => {
    const {
        NODE_ENV, DEBUG, PORT, JWT_SECRET, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET,
        GOOGLE_OAUTH_CALLBACK_REDIRECT_URI, SCACAP_ADMIN_BASE_URL, SCACAP_ADMIN_OAUTH_CLIENT_ID,
        SCACAP_ADMIN_OAUTH_CLIENT_SECRET
    } = process.env;

    const warnings = [];
    const errors = [];

    if (!_.isString(NODE_ENV)) {
        warnings.push(`Missing value ${NODE_ENV} for env \`NODE_ENV\`. Falling back to \`development\``);
    } else if (!_.includes(['development', 'production', 'test'], NODE_ENV)) {
        // eslint-disable-next-line
        errors.push(`Invalid value ${NODE_ENV} for env \`NODE_ENV\`. Expected \'development\`, \`production\`, or \`test\``);
    }

    if (!DEBUG) {
        warnings.push('Missing value for env `DEBUG`. Falling back to `false`');
    } else if (!_.includes(['true', 'false'], DEBUG)) {
        errors.push(`Invalid value \`${DEBUG}\` for env \`DEBUG\`. Expected \`true\` or \`false\``);
    }

    if (!_.isInteger(Number(PORT)) || Number(PORT) < 1 || Number(PORT) > 65535) {
        errors.push(`Invalid value \`${PORT}\` for env \`PORT\`. Expected int between 1 and 65535 inclusive`);
    }

    if (!_.isString(JWT_SECRET)) {
        errors.push(`Invalid value \`${JWT_SECRET}\` for env \`JWT_SECRET\`. Expected a string`);
    }

    if (!_.isString(GOOGLE_OAUTH_CLIENT_ID)) {
        // eslint-disable-next-line
        errors.push(`Invalid value \`${GOOGLE_OAUTH_CLIENT_ID}\` for env \`GOOGLE_OAUTH_CLIENT_ID\`. Expected a string`);
    }

    if (!_.isString(GOOGLE_OAUTH_CLIENT_SECRET)) {
        // eslint-disable-next-line
        errors.push(`Invalid value \`${GOOGLE_OAUTH_CLIENT_SECRET}\` for env \`GOOGLE_OAUTH_CLIENT_SECRET\`. Expected a string`);
    }

    if (!_.isString(GOOGLE_OAUTH_CALLBACK_REDIRECT_URI)) {
        // eslint-disable-next-line
        errors.push(`Invalid value \`${GOOGLE_OAUTH_CALLBACK_REDIRECT_URI}\` for env \`GOOGLE_OAUTH_CALLBACK_REDIRECT_URI\`. Expected a string`);
    }

    if (!_.isString(SCACAP_ADMIN_BASE_URL)) {
        errors.push(`Invalid value \`${SCACAP_ADMIN_BASE_URL}\` for env \`SCACAP_ADMIN_BASE_URL\`. Expected a string`);
    }

    if (!_.isString(SCACAP_ADMIN_OAUTH_CLIENT_ID)) {
        // eslint-disable-next-line
        errors.push(`Invalid value \`${SCACAP_ADMIN_OAUTH_CLIENT_ID}\` for env \`SCACAP_ADMIN_OAUTH_CLIENT_ID\`. Expected a string`);
    }

    if (!_.isString(SCACAP_ADMIN_OAUTH_CLIENT_SECRET)) {
        // eslint-disable-next-line
        errors.push(`Invalid value \`${SCACAP_ADMIN_OAUTH_CLIENT_SECRET}\` for env \`SCACAP_ADMIN_OAUTH_CLIENT_SECRET\`. Expected a string`);
    }

    warnings.forEach((warning) => logger.warn(warning));
    errors.forEach((error) => logger.error(error));

    // eslint-disable-next-line
    console.log('\n [Server environment]: \n\n',
        `NODE_ENV:                              ${NODE_ENV}\n`,
        `DEBUG:                                 ${DEBUG}\n`,
        `PORT:                                  ${PORT}\n`,
        'JWT_SECRET:                            ********\n',
        `GOOGLE_OAUTH_CLIENT_ID:                ${GOOGLE_OAUTH_CLIENT_ID}\n`,
        'GOOGLE_OAUTH_CLIENT_SECRET:            ******\n',
        `GOOGLE_OAUTH_CALLBACK_REDIRECT_URI:    ${GOOGLE_OAUTH_CALLBACK_REDIRECT_URI}\n`,
        `SCACAP_ADMIN_BASE_URL:                 ${SCACAP_ADMIN_BASE_URL}\n`,
        `SCACAP_ADMIN_OAUTH_CLIENT_ID:          ${SCACAP_ADMIN_OAUTH_CLIENT_ID}\n`,
        'SCACAP_ADMIN_OAUTH_CLIENT_SECRET:      ******\n'
    );

    if (errors.length) {
        const msg = 'Server attempted to start with one or more invalid environment variables. Exiting application.';
        logger.error(msg);
        throw new Error(msg);
    }

    return {
        warnings
    };
};

module.exports = validateAppEnvironment;
