// const TurnService = require('../src/game/turn-service');
const TestHelpers = require('./test-helpers');
const UserService = require('../src/user/user-service');
const knex = require('knex');
const bcrypt = require('bcrypt');
const { expect } = require('chai');
const supertest = require('supertest');

describe('User service object', () => {
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
  describe('registerUser', () => {
    it('writes a user in db and returns a user object with encrypted password', async () => {
      const password = 'password';
      const user = await UserService.registerUser(
        db,
        'test@ecample.net',
        password
      );

      const userFromDb = await db('app_user')
        .select('*')
        .where('id', user.id)
        .first();

      expect(user).to.eql(userFromDb);
      expect(bcrypt.compareSync(password, user.password)).to.be.true;
    });
  });
  describe('checkEmailTaken', () => {
    it('returns true for a used email and false for unused', async () => {
      await TestHelpers.seedFixtures(
        db,
        testUsers);
      const usedEmail = await UserService.checkEmailTaken(db, testUsers[0].email);
      const unusedEmail = await UserService.checkEmailTaken(db, 'unused@email.net')
      expect(usedEmail).to.be.true;
      expect(unusedEmail).to.be.false;
    })
  })
});

