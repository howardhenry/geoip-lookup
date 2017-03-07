const _ = require('lodash');

const settings = {
    app: {
        environment: _.get(process, 'env.NODE_ENV', 'development'),
        debug: _.get(process, 'env.DEBUG') === 'true',
        port: _.get(process, 'env.PORT'),
        routes: {
            public: [
                '/favicon.ico',
                '/healthy'
            ]
        }
    },
    api: {
        maxmind: {
            baseUrl: _.get(process, 'env.MAXMIND_BASE_URL')
        }
    }
};

module.exports = settings;
