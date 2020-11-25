const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const TestHelpers = require('./test-helpers');

describe('Score Endpoints', function () {
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

  describe('GET /api/score', () => {

    it('responds with 200 and array of scores', async function () {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );
      
      const responseBody = await supertest(app)
        .get('/api/score')
        .set(auth)
        .expect(200)
        .then(res => res.body);
      
        expect(responseBody).to.be.an('array');

        responseBody.forEach(score => {
          expect(score).to.be.an('object');
          expect(score).to.include.keys(
            'ended',
            'stageSize',
            'totalStages',
            'hintsUsed',
            'maxHints',
            'hintLimit',
            'successfulRolls',
            'totalRolls',
            'successfulSkips',
            'totalSkips',
            'position',
            'turnNumber'
          );
        });
    });
  });
});
