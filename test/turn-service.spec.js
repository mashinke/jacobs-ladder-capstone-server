// const TurnService = require('../src/game/turn-service');
const TestHelpers = require('./test-helpers');
const TurnService = require('../src/turn/turn-service');
const knex = require('knex');
const { expect } = require('chai');

describe('Game service object', () => {
  let db;
  const testUsers = TestHelpers.createTestUsers();
  const testGames = TestHelpers.createTestGames();
  const testCards = TestHelpers.createTestCards();
  const testQuestions = TestHelpers.createTestQuestions();
  const testAnswers = TestHelpers.createTestAnswers();
  const testTurns = TestHelpers.createTestTurns();
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
  describe('createTurn', () => {
    it('creates turn in database', async () => {
      console.log('seed fixtures')
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards
      );
      const gameId = testGames[0].id;
      const newTurn = {
        roll: 8,
        skip_attempt: false,
        use_hint: false,
        id_card: 3
      };
      turnId = await TurnService.createTurn(db, newTurn, gameId);
      const actual = await db('turn')
        .select('*')
        .where('id', turnId)
        .first();
      expect(actual).to.include(newTurn)
    });
  });
});