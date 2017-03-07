const path = require('path');
const fs = require('fs');
const co = require('co');
const _ = require('lodash');
const Bluebird = require('bluebird');
const maxmind = require('maxmind');
const gunzip = require('gunzip-maybe');
const request = require('request');
const progress = require('request-progress');
const logger = require('./logger');

const DB_CHECKSUM_FILE = path.join(__dirname, '../../db/checksum.md5');
const DB_FILE = path.join(__dirname, '../../db/maxmind.mmdb');

const saveDbChecksum = co.wrap(function* saveChecksum(value) {
    try {
        yield fs.writeFileAsync(DB_CHECKSUM_FILE, value, 'utf8');
    } catch (err) {
        logger.error(err);
    }
});

const getSavedDbChecksum = () => {
    let checksum = '';

    try {
        if (fs.existsSync(DB_CHECKSUM_FILE)) {
            checksum = fs.readFileSync(DB_CHECKSUM_FILE, 'utf8');
            checksum = checksum.trim();
        }
    } catch (err) {
        logger.error(err);
    }

    return checksum;
};

const getRemoteDbChecksum = co.wrap(function* getChecksum() {
    let checksum = '';

    try {
        const response = yield request.getAsync('http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.md5');

        checksum = response.body;
        checksum = _.isString(checksum) ? checksum.trim() : '';

        yield saveDbChecksum(checksum);
    } catch (err) {
        logger.error(err);
    }

    return checksum;
});

const refreshDb = co.wrap(function* refreshDb() {
    try {
        const savedChecksum = getSavedDbChecksum();
        const remoteChecksum = yield getRemoteDbChecksum();

        if (savedChecksum !== remoteChecksum) {
            yield fs.unlinkAsync(DB_CHECKSUM_FILE);

            const url = 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz';
            progress(request(url), {})
                .on('progress', (state) => {
                    logger.info(state);
                })
                .on('error', (err) => {
                    logger.error(err);
                })
                .on('end', () => {
                    saveDbChecksum(remoteChecksum);
                    logger.info('Done!');
                })
                .pipe(gunzip())
                .pipe(fs.createWriteStream(DB_FILE));
        }
    } catch (err) {
        logger.error(err);
    }
});

const validateIp = (value) => {
    return maxmind.validate(value);
};

const formatGeoData = (geoData, options) => {
    const formattedData = geoData;

    // Strip all except the specified language
    _.forEach(geoData, (obj, key) => {
        const names = _.get(obj, 'names');

        if (_.isPlainObject(names)) {
            formattedData[key].names = _.pick(names, options.lang);

            // Remove `geoname_id` property if verbose is not set
            if (!options.verbose) {
                delete formattedData[key].geoname_id;
            }
        } else if (key === 'subdivisions' && _.isArray(obj) && obj.length > 0) {
            obj.forEach((subdivision, ix) => {
                formattedData[key][ix].names = _.pick(subdivision.names, options.lang);

                // Remove `geoname_id` property if verbose is not set
                if (!options.verbose) {
                    delete formattedData[key][ix].geoname_id;
                }
            });
        }
    });

    return formattedData;
};

const lookupGeoData = co.wrap(function* lookup(value, options) {
    let geoData = {};

    try {
        const openAsync = Bluebird.promisify(maxmind.open);
        const cityLookup = yield openAsync(DB_FILE);
        geoData = cityLookup.get(value);
        geoData = formatGeoData(geoData, options);
    } catch (err) {
        logger.error(err);
    }

    return _.isPlainObject(geoData) ? geoData : {};
});

module.exports = {
    refreshDb,
    validateIp,
    lookupGeoData
};
