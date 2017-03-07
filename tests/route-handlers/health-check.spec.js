const supertest = require('supertest');
const app = require('../../src');

describe('GET /healthy', () => {
    afterEach(() => {
        app.server.close();
    });

    it('should return 200 if the application is launched', (done) => {
        supertest(app)
            .get('/healthy')
            .expect(200, done);
    });
});
