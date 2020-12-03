const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const TestHelpers = require('./test-helpers');

describe('Game Endpoints', function () {
  let db;

  const testUsers = TestHelpers.createTestUsers();
  const testGames = TestHelpers.createTestGames();
  const testCards = TestHelpers.createTestCards();
  const testQuestions = TestHelpers.createTestQuestions();
  const testAnswers = TestHelpers.createTestAnswers();
  const testTurns = TestHelpers.createTestTurns();
  const auth = {
    authorization: `bearer ${TestHelpers.generateJWT(testUsers[0])}`
  };

  before('establish db connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
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

  describe('POST /api/game', () => {
    beforeEach('seed users', () =>
      TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames
      )
    );

    it('with invalid data, responds with 400', async function () {
      const requestBody = {
        hintLimit: false,
      };
      await supertest(app)
        .post('/api/game')
        .set(auth)
        .send(requestBody)
        .expect(400);
    });
    it('with valid data, creates a game and response with 200', async function () {
      const numberOfGamesBefore = await db('game')
        .count().first().then(row => Number(row.count));
      const requestBody = {
        totalStages: 6,
        maxHints: 18,
        hintLimit: true
      };
      await supertest(app)
        .post('/api/game')
        .set(auth)
        .send(requestBody)
        .expect(200);

      const numberOfGamesAfter = await db('game')
        .count().first().then(row => Number(row.count));
      expect(numberOfGamesBefore).to.eql(numberOfGamesAfter - 1);
    });
  });
  describe('GET /api/game', () => {
    it('responds with game state, game settings, and cards to play', async () => {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );

      const response = await supertest(app)
        .get('/api/game')
        .set(auth)
        .expect(200);

      const { gameSettings, gameState, rollCard, skipCard } = response.body;

      expect(gameSettings).to.be.an('object');
      expect(gameState).to.be.an('object');
      expect(rollCard).to.be.an('object');
      expect(skipCard).to.be.an('object');
      expect(gameSettings).to.include.keys(
        'gameId',
        'maxHints',
        'hintLimit',
        'totalStages',
        'stageSize',
        'lastTurn',
        'ended');
      expect(gameState).to.include.keys(
        'hintsUsed',
        'position',
        'successfulRolls',
        'totalRolls',
        'successfulSkips',
        'totalSkips'
      );
      [rollCard, skipCard].forEach(card => {
        expect(card).to.include.keys(
          'altText',
          'questionText',
          'answers'
        );
        expect(card.answers).to.be.an('array');
      });
    });
  });
});
