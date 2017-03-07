const { assert } = require('chai');
const sinon = require('sinon');
const logger = require('../../src/utils/logger');

describe('logger', () => {
    const message = 'test message';
    let logMessageSpy;

    beforeEach(() => {
        logMessageSpy = sinon.spy(logger, 'logMessage');
    });

    afterEach(() => {
        logMessageSpy.restore();
    });

    describe('#dbeug', () => {
        it('should call #logMessage with level = "debug" and the supplied message', () => {
            logger.debug(message);

            assert.isTrue(logMessageSpy.calledWith('debug', message));
        });
    });

    describe('#info', () => {
        it('should call #logMessage with level = "info" and the supplied message', () => {
            logger.info(message);

            assert.isTrue(logMessageSpy.calledWith('info', message));
        });
    });

    describe('#warn', () => {
        it('should call #logMessage with level = "warn" and the supplied message', () => {
            logger.warn(message);

            assert.isTrue(logMessageSpy.calledWith('warn', message));
        });
    });

    describe('#error', () => {
        it('should call #logMessage with level = "error" and the supplied message', () => {
            logger.error(message);

            assert.isTrue(logMessageSpy.calledWith('error', message));
        });
    });
});
