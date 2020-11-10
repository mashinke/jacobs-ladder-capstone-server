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
        testUsers
      )
    );

    it('with no request body, responds with 400', async function () {
      response = await supertest(app)
        .post('/api/game')
        .expect(400)
    })

    it('with gameLength missing, returns 400', async () => {
      const requestBody = {
        hintLimited: false,
      };
      const result = await supertest(app)
        .post('/api/game')
        .send(requestBody)
        .expect(400);
    })
    it('with both hintLimited and hintLimit missing, returns 400', async () => {
      const requestBody = {
        gameLength: 6
      }
      const result = await supertest(app)
        .post('/api/game')
        .send(requestBody)
        .expect(400)
    })
    it('with invalid hintLimit, returns 400', async () => {
      const requestBody = {
        gameLength: 6,
        hintLimited: true,
        hintLimit: -1
      }

      const result = await supertest(app)
        .post('/api/game')
        .send(requestBody)
        .expect(400);
    })
    it.only('with valid request, creates a game and response with 201 and responds with game location', async function () {
      const requestBody = {
        gameLength: 6,
        hintLimited: true,
        hintLimit: 18
      }
      response = await supertest(app)
        .post('/api/game')
        .send(requestBody)
        .expect(201)
      const gameId = response.body.gameId;

      const expected = {
        id: gameId,
        stage_size: 18,
        total_stages: 6,
        max_hints: 18,
        hint_limit: true,
        ended: false,
        id_user: 1 // for now, default to id_user = 1
      }

      console.log('res.body', response.body)
      const actual = await db('game')
        .select('*')
        .where('id', gameId)
        .first();
      expect(actual).to.eql(expected);
    });
  });
});
