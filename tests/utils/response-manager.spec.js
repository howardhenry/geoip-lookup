const { assert } = require('chai');
const sinon = require('sinon');
const responseManager = require('../../src/utils/response-manager');

describe('Response Manager', () => {
    describe('#handleSuccess', () => {
        let res;
        let resStatusSpy;

        beforeEach(() => {
            res = {
                status: () => { return { json: () => { return { end: () => {} }; } }; }
            };

            resStatusSpy = sinon.spy(res, 'status');
        });

        it('should respond with status 200 if no status code is specified', () => {
            responseManager.handleSuccess(res);

            assert.isTrue(resStatusSpy.calledWith(200));
        });

        it('should respond with status 200, 201 or 204 if status code is specified', () => {
            responseManager.handleSuccess(res, 200);
            assert.isTrue(resStatusSpy.calledWith(200));

            responseManager.handleSuccess(res, 201);
            assert.isTrue(resStatusSpy.calledWith(201));

            responseManager.handleSuccess(res, 204);
            assert.isTrue(resStatusSpy.calledWith(204));
        });

        it('should respond with status 200 if an unaccepted status code is specified', () => {
            responseManager.handleSuccess(res, 250);
            assert.isTrue(resStatusSpy.calledWith(200));
        });
    });

    describe('#handleRedirect', () => {
        let res;
        let resRedirectSpy;

        beforeEach(() => {
            res = { redirect: () => {} };
            resRedirectSpy = sinon.spy(res, 'redirect');
        });

        it('should call the redirect method with the specified status code and url', () => {
            responseManager.handleRedirect(res, 302, 'http://foo.com');
            assert.isTrue(resRedirectSpy.calledWith(302, 'http://foo.com'));
        });
    });

    describe('#handleError', () => {
        let res;
        let resStatusSpy;

        beforeEach(() => {
            res = {
                status: () => { return { json: () => { return { end: () => {} }; } }; }
            };

            resStatusSpy = sinon.spy(res, 'status');
        });

        it('should respond with status 500 if no status code is specified', () => {
            responseManager.handleError(res, null, null, 'GATEWAY');

            assert.isTrue(resStatusSpy.calledWith(500));
        });

        it('should respond with status 400, 401, 404 or 500 if status code is specified', () => {
            responseManager.handleError(res, 400, null, 'GATEWAY');
            assert.isTrue(resStatusSpy.calledWith(400));

            responseManager.handleError(res, 401, null, 'GATEWAY');
            assert.isTrue(resStatusSpy.calledWith(401));

            responseManager.handleError(res, 404, null, 'GATEWAY');
            assert.isTrue(resStatusSpy.calledWith(404));

            responseManager.handleError(res, 500, null, 'GATEWAY');
            assert.isTrue(resStatusSpy.calledWith(500));
        });

        it('should respond with status 500 if an unaccepted status code is specified', () => {
            responseManager.handleError(res, 984, null, 'GATEWAY');
            assert.isTrue(resStatusSpy.calledWith(500));
        });
    });
});
