const { expect } = require('chai');
const validateAppEnvironment = require('../src/validate-app-environment');

describe('#validateAppEnvironment', () => {
    let fn;

    beforeEach(() => {
        process.env.NODE_ENV = 'development';
        process.env.DEBUG = 'false';
        process.env.PORT = '9000';
    });

    it('should not throw an error if valid environment variables are present', () => {
        fn = () => { validateAppEnvironment(); };
        expect(fn).to.not.throw(Error);
    });

    it('should throw an error if env `NODE_ENV` is not `development`, `production` or `test`', () => {
        process.env.NODE_ENV = 'foo';
        fn = () => { validateAppEnvironment(); };
        expect(fn).to.throw(Error);
    });

    it('should throw an error if env `DEBUG` is defined and not `true` or `false`', () => {
        process.env.DEBUG = 'foo';
        fn = () => { validateAppEnvironment(); };
        expect(fn).to.throw(Error);
    });

    it('should throw an error if env `PORT` is not between `1` and `65535` inclusive', () => {
        process.env.PORT = -10;
        fn = () => { validateAppEnvironment(); };
        expect(fn).to.throw(Error);

        process.env.PORT = 65540;
        fn = () => { validateAppEnvironment(); };
        expect(fn).to.throw(Error);
    });
});
