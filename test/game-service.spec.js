const GameService = require('../src/game/game-service');
const TestHelpers = require('./test-helpers');
const knex = require('knex');
const { expect } = require('chai');
const { seedFixtures } = require('./test-helpers');

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
      connection: dbConnection
    });
  });
  before('ensure test db is empty', () => {
    return db.raw('truncate turn, card, question, answer, game, app_user restart identity cascade');
  });
  after('destroy db connection', () => {
    return db.destroy();
  });
  afterEach('clear db data', () => {
    return db.raw('truncate turn, card, question, answer, game, app_user restart identity cascade');
  });

  describe('createNewGame', () => {
    it('creates game in db', async () => {
      await seedFixtures(db, testUsers);
      const userId = 1;
      const newGame = {
        total_stages: 6,
        hint_limit: true,
        max_hints: 3
      };
      const gameId = await GameService.createNewGame(db, userId, newGame);
      const actual = await db('game')
        .select('*')
        .where('id', gameId)
        .first();
      expect(actual).to.include(newGame);
    });
  });

  describe('getGameSettingsByGame', () => {
    it('returns the correct game settings object', async () => {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );

      const gameId = 1;

      const expected = await db('game')
        .where('id', gameId)
        .first();
      const actual = await GameService.getGameSettingsByGame(db, gameId);

      expect(actual).to.be.an('object');
      expect(actual).to.eql(expected);
    });
  });

  describe('getActiveGameSettingsByUser', () => {
    it('returns the correct game settings object', async () => {
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

      const expected = await db('game')
        .where('id_user', userId)
        .where({ active: true })
        .first();
      const actual = await GameService.getActiveGameSettingsByUser(db, userId);

      expect(actual).to.be.an('object');
      expect(actual).to.eql(expected);
    });
  });

  describe('getActiveGameTurnsByUser', () => {
    it('returns an array of all turn objects which belong to the active game', async () => {
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
      const activeGame = await GameService.getActiveGameSettingsByUser(
        db,
        userId
      );
      const activeGameTurnCount = await db('turn')
        .select()
        .where('id_game', activeGame.id)
        .count()
        .first()
        .then(obj => Number(obj.count));

      const actual = await GameService.getActiveGameTurnsByUser(db, userId);

      expect(actual).to.be.an('array');
      expect(actual.length).to.eql(activeGameTurnCount);

      actual.forEach(turn => {
        expect(turn).to.be.an('object');
        expect(turn).to.include.keys(
          'id_game',
          'id_card',
          'skip_attempt',
          'skip_success',
          'roll',
          'use_hint'
        );
        expect(turn.id_game).to.eql(activeGame.id);
      });
    });
  });

  describe('checkGameLastTurnByUser', () => {
    it('returns correct true or false', async () => {
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
      const expected = await db('game')
        .select('last_turn')
        .where('id_user', userId)
        .where('active', true)
        .where('ended', false)
        .first()
        .then(turn => turn.last_turn);
      const actual = await GameService.checkGameLastTurnByUser(db, userId);

      expect(actual).to.be.a('boolean');
      expect(actual).to.eql(expected);
    });
  });

  describe('getActiveGameIdByUser', () => {
    it('returns a game id', async () => {
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
      const actual = await GameService.getActiveGameIdByUser(db, userId);
      const game = await GameService.getActiveGameSettingsByUser(db, userId);

      expect(actual).to.be.a('number');
      expect(actual).to.eql(game.id);
    });
  });

  describe('flagGameLastTurnByUser', () => {
    it('flags a game as being on its last turn', async () => {
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

      const before = await GameService.checkGameLastTurnByUser(db, userId);
      expect(before).to.eql(false); // to make sure the change happens

      await GameService.flagGameLastTurnByUser(db, userId);

      const actual = await GameService.checkGameLastTurnByUser(db, userId);
      expect(actual).to.eql(true);
    });
  });

  describe('winActiveGameByUser', () => {
    it('flags game as ended', async () => {
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

      const before = await db('game')
        .select('ended')
        .where('id_user', userId)
        .where('active', true)
        .first()
        .then(game => game.ended);
      expect(before).to.eql(false);

      await GameService.winActiveGameByUser(db, userId);

      const actual = await db('game')
        .select('ended')
        .where('id_user', userId)
        .where('active', true)
        .first()
        .then(game => game.ended);

      expect(actual).to.eql(true);
    });
  });

  describe('getAllGameTurnsByUser', () => {
    it('returns an array of all turn objects which belong to the user, sorted by game', async () => {
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
      const allGames = await GameService.getAllGameTurnsByUser(
        db,
        userId
      );

      expect(allGames).to.be.an('object');

      const gameCount = await db('game')
        .count()
        .where('id_user', userId)
        .first()
        .then(obj => Number(obj.count));

      expect(Object.keys(allGames).length).to.eql(gameCount);

      Object.values(allGames).forEach(async currGameTurns => {
        const currGameId = currGameTurns[0].id_game;
        const currentGameTurnCount = await db('turn')
          .count()
          .where({ id_game: currGameId })
          .first()
          .then(obj => Number(obj.count));
        expect(currGameTurns.length).to.eql(currentGameTurnCount);

        currGameTurns.forEach(turn => {
          expect(turn).to.be.an('object');
          expect(turn).to.include.keys(
            'id_game',
            'id_card',
            'skip_attempt',
            'skip_success',
            'roll',
            'use_hint'
          );
          expect(turn.id_game).to.eql(currGameId);
        });
      });
    });
  });

  describe('getAllGamesByUser', () => {
    it('returns an array of game id numbers', async () => {
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

      const actual = await GameService.getAllGameIdsByUser(db, userId);

      expect(actual).to.be.an('array');

      actual.forEach(id => {
        expect(Number(id)).to.be.a('number');
      });
    });
  });

  describe('reduceGameStateByGame', () => {
    it('returns a game state object', async () => {
      await TestHelpers.seedFixtures(
        db,
        testUsers,
        testGames,
        testAnswers,
        testQuestions,
        testCards,
        testTurns
      );

      const gameId = 1;
      const gameState = await GameService.reduceGameStateByGame(db, gameId);

      expect(gameState).to.be.an('object');
      expect(gameState).to.include.keys(
        'hintsUsed',
        'position',
        'successfulRolls',
        'totalRolls',
        'successfulSkips',
        'totalSkips'
      );
    });
  });

  describe('reduceActiveGameStateByUser', () => {
    it('returns a game state object', async () => {
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
      const gameState = await GameService.reduceActiveGameStateByUser(db, userId);

      expect(gameState).to.be.an('object');
      expect(gameState).to.include.keys(
        'hintsUsed',
        'position',
        'successfulRolls',
        'totalRolls',
        'successfulSkips',
        'totalSkips'
      );
    });
  });
});