const { assert, expect } = require('chai');
const sinon = require('sinon');
const handleRouteNotFound = require('../../src/middleware/handle-route-not-found');

describe('handleRouteNotFound middleware', () => {
    const req = {};
    let res;
    let resStatusSpy;

    beforeEach(() => {
        res = { status: () => { return { json: () => { return { end: () => {} }; } }; } };
        resStatusSpy = sinon.spy(res, 'status');
    });

    it('should return a function', () => {
        expect(handleRouteNotFound()).to.be.a('function');
    });

    it('should accept two arguments', () => {
        expect(handleRouteNotFound().length).to.equal(2);
    });

    it('should respond with status 404', () => {
        handleRouteNotFound()(req, res);
        assert.isTrue(resStatusSpy.calledWith(404));
    });
});
