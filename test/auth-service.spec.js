// const TurnService = require('../src/game/turn-service');
const TestHelpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');
const UserService = require('../src/user/user-service');
const jwt = require('jsonwebtoken');
const knex = require('knex');
const { expect } = require('chai');

describe('Auth service object', () => {
  let db;
  const testUsers = TestHelpers.createTestUsers();
  before('establish db connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
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
  describe('authenticateLogin', () => {
    it('creates returns a valid jwt token for valid credentials and undefined for invalid', async () => {
      const userEmail = 'one@two.com';
      const userPass = 'password';
      await UserService.registerUser(db, userEmail, userPass)
      validCreds = await AuthService(db, userEmail, userPass);
      invalidCreds = await AuthService(db, userEmail, 'foo');

      expect(validCreds).to.be.a('string');
      expect(invalidCreds).to.be.undefined;

      const { sub: email } = jwt.verify(validCreds, process.env.JWT_SECRET)
      expect(email).to.eql(userEmail);
    });
  });
});