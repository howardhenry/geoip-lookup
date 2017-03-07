const { assert, expect } = require('chai');
const sinon = require('sinon');
const requestLogger = require('../../src/middleware/request-logger');

describe('requestLogger middleware', () => {
    const req = {};
    const res = { socket: '' };
    let next;

    beforeEach(() => {
        next = sinon.spy();
    });

    it('should return a function', () => {
        expect(requestLogger()).to.be.a('function');
    });

    it('should accept three arguments', () => {
        expect(requestLogger().length).to.equal(3);
    });

    it('should call next()', () => {
        requestLogger()(req, res, next);
        assert.isTrue(next.called);
    });
});
