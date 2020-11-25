// const TurnService = require('../src/game/turn-service');
const TestHelpers = require('./test-helpers');
const CardService = require('../src/card/card-service');
const knex = require('knex');
const { expect } = require('chai');
const supertest = require('supertest');

describe('Card service object', () => {
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
  describe('getRandomCard', () => {
    it('returns a card object', async () => {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );

      const userId = 1;

      const card = await CardService.getRandomCard(db, userId);
      expect(card).to.be.an('object');
      expect(card).to.include.keys(
        'id',
        'alt_text',
        'question_text',
        'answers'
      );
      expect(card.answers).to.be.an('array');
      card.answers.forEach(answer => {
        expect(answer).to.be.a('string');
      })
    })
  })

  describe('getAnswer', () => {
    it('returns the correct answer text for a give question', async () => {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );

      cardId = 1;

      const expected = testAnswers[testCards[cardId - 1]
        .id_answer - 1]
        .answer_text;

      const answer = await CardService.getAnswer(db, cardId);

      expect(answer).to.eql(expected);
    });
  });

  describe('makeActiveGameUsedCardPileByUser', () => {
    it('returns an array of card id numbers', async () => {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );

      const userId = 1;

      const stack = await CardService.makeActiveGameUsedCardPileByUser(db, userId);

      expect(stack).to.be.an('array');
      stack.forEach(card_id => {
        expect(card_id).to.be.a('number');
      });
    });
  });
});

