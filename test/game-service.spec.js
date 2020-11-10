const GameService = require('../src/game/game-service');
const TestHelpers = require('./test-helpers');
const knex = require('knex');
const { expect } = require('chai');
const { seedFixtures } = require('./test-helpers');

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
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames
      )
      const userId = testUsers[0].id;
      const expected = testGames.filter(game => game.id === userId)[0];
      const actual = await GameService.getGameByUser(db, userId);
      expect(actual).to.eql(expected);
    });
  });
  describe('createNewGame', () => {
    it('creates game in db and returns object', async () => {
      await seedFixtures(db, testUsers);
      const userId = testUsers[0].id;
      const newGame = {
        total_stages: 6,
        hint_limit: true,
        max_hints: 3
      }
      const gameId = await GameService.createNewGame(db, userId, newGame);
      const actual = await db('game')
        .select('*')
        .where('id', gameId)
        .first();
      expect(actual).to.include(newGame);
    })
  })
});