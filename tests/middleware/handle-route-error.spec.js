const { assert, expect } = require('chai');
const sinon = require('sinon');
const handleRouteError = require('../../src/middleware/handle-route-error');

describe('handleRouteError middleware', () => {
    const req = {};
    let res;
    let resStatusSpy;
    let next;

    beforeEach(() => {
        res = { status: () => { return { json: () => { return { end: () => {} }; } }; } };
        next = sinon.spy();
        resStatusSpy = sinon.spy(res, 'status');
    });

    it('should return a function', () => {
        expect(handleRouteError()).to.be.a('function');
    });

    it('should accept four arguments', () => {
        expect(handleRouteError().length).to.equal(4);
    });

    it('should call next() if there is no error', () => {
        handleRouteError()(null, req, res, next);
        assert.isTrue(next.called);
    });

    it('should respond with status 500 if an error occurred', () => {
        handleRouteError()('some error', req, res, next);
        assert.isFalse(next.called);
        assert.isTrue(resStatusSpy.calledWith(500));
    });
});
