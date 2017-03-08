const path = require('path');
const _ = require('lodash');

const settings = {
    app: {
        environment: _.get(process, 'env.NODE_ENV', 'development'),
        debug: _.get(process, 'env.DEBUG') === 'true',
        port: _.get(process, 'env.PORT', 9000)
    },
    maxmind: {
        dbChecksumUrl: 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.md5',
        dbUrl: 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz',
        dbChecksumFilePath: path.join(__dirname, '../db/geolite2-city-checksum.md5'),
        dbFilePath: path.join(__dirname, '../db/geolite2-city.mmdb')
    }
};

module.exports = settings;
