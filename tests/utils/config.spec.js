const rewire = require('rewire');
const { expect } = require('chai');

const configUtils = rewire('../../src/utils/config');

describe('config utils', () => {
    let mockSettings;
    let revert;

    beforeEach(() => {
        mockSettings = {
            app: {
                environment: process.env.NODE_ENV,
                port: 9999
            },
            mock: 'foo',
            bar: { baz: 'someValue' }
        };
        revert = configUtils.__set__('SETTINGS', mockSettings);
    });

    afterEach(() => {
        revert();
    });

    describe('#getPort', () => {
        it('should return API port number retrieve from the settings config', () => {
            const port = configUtils.getPort();
            expect(port).to.equal(9999);
        });
    });

    describe('#getSetting', () => {
        it('should return the value of the object at the specified path in the settings config', () => {
            let setting = configUtils.getSetting('mock');
            expect(setting).to.equal('foo');

            setting = configUtils.getSetting('bar.baz');
            expect(setting).to.equal('someValue');
        });

        it('should return undefined is the setting does not exist', () => {
            const setting = configUtils.getSetting('unknown.setting');
            expect(setting).to.equal(undefined);
        });
    });

    describe('#getEnv', () => {
        it('should return Node environment specified in the environment variable "NODE_ENV"', () => {
            const env = configUtils.getEnv();
            expect(env).to.equal(process.env.NODE_ENV);
        });
    });
});
