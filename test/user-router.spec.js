const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const TestHelpers = require('./test-helpers');

describe('User Endpoints', function () {
  let db;

  const testUsers = TestHelpers.createTestUsers();
  const auth = {
    authorization: `bearer ${TestHelpers.generateJWT(testUsers[0])}`
  };

  before('establish db connection', () => {
    db = knex({
      client: 'pg',
      connection: dbConnection
    });
    app.set('db', db);
  });
  before('ensure test db is empty', () => {
    return db.raw('truncate game, app_user, turn, card, question, answer restart identity cascade');
  });
  after('destroy db connection', () => {
    return db.destroy();
  });
  afterEach('clear db data', () => {
    return db.raw('truncate game, app_user, turn, card, question, answer restart identity cascade');
  });

  describe('POST /api/user', () => {

    it('with invalid data, responds with 400', async function () {
      const requestBody = {
        email: 'foo',
        password: 'bar'
      };
      await supertest(app)
        .post('/api/user')
        .send(requestBody)
        .expect(400);
      await supertest(app)
        .post('/api/user')
        .send({ foo: 'bar' })
        .expect(400);
    });

    it('with valid data, creates a user and responds with 200', async function () {
      const requestBody = {
        email: 'test@example.com',
        password: 'password'
      };
      await supertest(app)
        .post('/api/user')
        .set(auth)
        .send(requestBody)
        .expect(200);
    });
  });
});
