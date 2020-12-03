const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const TestHelpers = require('./test-helpers');

describe('Turn Endpoints', function () {
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

  describe('POST /api/turn', () => {

    it('with invalid data, responds with 400', async function () {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );
      const requestBody = {
        foo: false,
      };
      await supertest(app)
        .post('/api/turn')
        .set(auth)
        .send(requestBody)
        .expect(400);
    });
    it('with valid data, creates a turn and responds with 200 and turn object', async function () {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );

      const requestBody = {
        cardId: 1,
        answer: 'alef',
        skipCard: false,
        useHint: false
      };
      const responseBody = await supertest(app)
        .post('/api/turn')
        .set(auth)
        .send(requestBody)
        .expect(200)
        .then(res => res.body);

      expect (responseBody).to.have.keys(
        'roll',
        'correctAnswer',
        'useHint',
        'lastTurn',
        'skipSuccess',
        'gameWon'
      );
    });
  });
});
