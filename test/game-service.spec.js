const GameService = require('../src/game/game-service');
const TestHelpers = require('./test-helpers');
const knex = require('knex');
const { expect } = require('chai');

describe('Game service object', () => {
  let db;
  const testUsers = TestHelpers.createTestUsers();
  const testGames = TestHelpers.createTestGames();
  before('establish db connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
  });
  before('ensure test db is empty', () => {
    return db.raw('truncate game, app_user restart identity cascade');
  });
  after('destroy db connection', () => {
    return db.destroy();
  });
  afterEach('clear db data', () => {
    return db.raw('truncate game, app_user restart identity cascade');
  });
  describe('getGameByUser', () => {
    it('returns correct game from db', async () => {
      await db.into('app_user').insert(testUsers);
      await db.into('game').insert(testGames);
      const userId = testUsers[0].id;
      const expected = testGames.filter(game => game.id === userId)[0];
      const actual = await GameService.getGameByUser(db, userId);
      expect(actual).to.eql(expected);
    });
  });
});