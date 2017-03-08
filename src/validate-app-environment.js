const _ = require('lodash');
const logger = require('./utils/logger');

const validateAppEnvironment = () => {
    const { NODE_ENV = 'development', DEBUG = 'false', PORT = '9000' } = process.env;

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

    if (!PORT) {
        warnings.push('Missing value for env `PORT`. Falling back to `9000`');
    } else if (!_.isInteger(Number(PORT)) || Number(PORT) < 1 || Number(PORT) > 65535) {
        errors.push(`Invalid value \`${PORT}\` for env \`PORT\`. Expected int between 1 and 65535 inclusive`);
    }

    warnings.forEach((warning) => logger.warn(warning));
    errors.forEach((error) => logger.error(error));

    // eslint-disable-next-line
    console.log('\n [Server environment]: \n\n',
        `NODE_ENV:      ${NODE_ENV}\n`,
        `DEBUG:         ${DEBUG}\n`,
        `PORT:          ${PORT}\n`
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
