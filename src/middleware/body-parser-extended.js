const unless = require('express-unless');
const bodyParser = require('body-parser');

const json = (options) => {
    const mw = bodyParser.json(options);
    mw.unless = unless;

    return mw;
};

const urlEncoded = (options) => {
    const mw = bodyParser.urlencoded(options);
    mw.unless = unless;

    return mw;
};

module.exports = {
    json,
    urlEncoded
};
