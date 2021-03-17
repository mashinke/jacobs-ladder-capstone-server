const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const UserService = require('../src/user/user-service');

describe('Auth Endpoints', function () {
  let db;

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

  describe('POST /api/auth', () => {
    const userEmail = 'one@two.com';
    const userPass = 'password';

    beforeEach('insert a valid user', async () => {
      await UserService.registerUser(db, userEmail, userPass);
    });

    it('with invalid credentials, responds with 401', async function () {
      const requestBody = {
        email: 'foo',
        password: 'bar'
      };
      await supertest(app)
        .post('/api/auth')
        .send(requestBody)
        .expect(401);
    });

    it('with valid credentials, responds with 200', async function () {
      const requestBody = {
        email: userEmail,
        password: userPass
      };
      const responseBody = await supertest(app)
        .post('/api/auth')
        .send(requestBody)
        .expect(200)
        .then(res => res.body);
      expect(responseBody.token).to.be.a('string');
      const { sub: email } = jwt.verify(responseBody.token, process.env.JWT_SECRET);
      expect(email).to.eql(userEmail);
    });
  });
});
