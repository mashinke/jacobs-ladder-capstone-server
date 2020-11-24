const { expect } = require('chai');
const { request } = require('http');
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
  }

  before('establish db connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db)
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
    })
    it('with valid data, creates a game and response with 201 and responds with game location', async function () {
      const requestBody = {
        totalStages: 6,
        maxHints: 18,
        hintLimit: true
      }
      response = await supertest(app)
        .post('/api/game')
        .set(auth)
        .send(requestBody)
        .expect(201)
      const gameId = response.body.gameId;

      const expected = {
        id: gameId,
        active: true,
        stage_size: 18,
        total_stages: 6,
        max_hints: 18,
        hint_limit: true,
        last_turn: false,
        ended: false,
        id_user: 1 // for now, default to id_user = 1
      }

      const actual = await db('game')
        .select('*')
        .where('id', gameId)
        .first();
      expect(actual).to.eql(expected);
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
        .expect(200)
      
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
