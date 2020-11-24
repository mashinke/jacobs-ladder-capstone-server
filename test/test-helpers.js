const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/config');

module.exports = {
  createTestGames() {
    return [
      {
        stage_size: 18,
        total_stages: 6,
        hint_limit: true,
        max_hints: 18,
        ended: true,
        id_user: 1,
        active: false
      },
      {
        stage_size: 18,
        total_stages: 6,
        hint_limit: false,
        max_hints: 18,
        ended: false,
        id_user: 1
      }
    ];
  },
  createTestUsers() {
    return [
      {
        email: 'testone@example.net',
        password: '$2b$10$kxCpib6Qm2AOws4yfCnrf.HOeXWpUDOXwxuElpK0ggzGdZpFYgRsS'
      }
    ];
  },
  createTestTurns() {
    return [
      {
        roll: 8,
        skip_attempt: false,
        use_hint: false,
        id_game: 1,
        id_card: 1
      },
      {
        roll: null,
        skip_attempt: true,
        skip_success: false,
        use_hint: false,
        id_game: 1,
        id_card: 5
      },
      {
        roll: null,
        skip_attempt: true,
        use_hint: true,
        id_game: 1,
        id_card: 3
      },
      {
        roll: null,
        skip_attempt: false,
        use_hint: false,
        id_game: 2,
        id_card: 4
      },
    ];
  },
  createTestCards() {
    return [
      {
        alt_text: 'the letter alef with background',
        id_question: 1,
        id_answer: 1,
        difficulty: 1
      },
      {
        alt_text: 'the letter dales with background',
        id_question: 1,
        id_answer: 2,
        difficulty: 1
      },
      {
        alt_text: 'the letter gimel with background',
        id_question: 1,
        id_answer: 3,
        difficulty: 1
      },
      {
        alt_text: 'the letter hey with background',
        id_question: 1,
        id_answer: 4,
        difficulty: 1
      },
      {
        alt_text: 'the word "meynen" with background',
        id_question: 2,
        id_answer: 5,
        difficulty: 2
      },
      {
        alt_text: 'the word "geyn" with background',
        id_question: 2,
        id_answer: 6,
        difficulty: 2
      },
      {
        alt_text: 'the word "lernen" with background',
        id_question: 2,
        id_answer: 7,
        difficulty: 2
      },
      {
        alt_text: 'the word "shpiln" with background',
        id_question: 2,
        id_answer: 8,
        difficulty: 2
      },
    ];

  },
  createTestQuestions() {
    return [
      {
        question_text: 'what is the name of this letter'
      },
      {
        question_text: 'what does this word mean?'
      }
    ];

  },
  createTestAnswers() {
    return [
      {
        answer_text: 'alef'
      },
      {
        answer_text: 'dales'
      },
      {
        answer_text: 'gimel'
      },
      {
        answer_text: 'hey'
      },
      {
        answer_text: 'to think'
      },
      {
        answer_text: 'to go'
      },
      {
        answer_text: 'to learn'
      },
      {
        answer_text: 'to play'
      }
    ];
  },
  seedFixtures: async function (
    db,
    testUsers,
    testGames,
    testAnswers,
    testQuestions,
    testCards,
    testTurns,
  ) {
    await db.into('app_user').insert(testUsers);
    await db.into('game').insert(testGames);
    await db.into('answer').insert(testAnswers);
    await db.into('question').insert(testQuestions);
    await db.into('card').insert(testCards);
    await db.into('turn').insert(testTurns);
    return;
  },
  generateJWT(user) {
    const { email, id } = user;
    return jwt.sign(
      { id, expiresIn: '7d' },
      JWT_SECRET,
      {
        subject: email,
        algorithm: 'HS256'
      });
  }
};