const Bluebird = require('bluebird');

Bluebird.promisifyAll(require('request'));
