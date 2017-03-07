const Bluebird = require('bluebird');

Bluebird.promisifyAll(require('fs'));
Bluebird.promisifyAll(require('request'));
