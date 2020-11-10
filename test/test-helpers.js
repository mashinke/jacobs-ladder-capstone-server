module.exports = {
  createTestGames() {
    return [
      {
        id: 1,
        stage_size: 18,
        total_stages: 6,
        hint_limit: true,
        max_hints: 18,
        ended: false,
        id_user: 1
      }
    ];
  },
  createTestUsers() {
    return [
      {
        id: 1,
        email: 'testone@example.net'
      },
      {
        id: 2,
        email: 'testtwo@example.net'
      }
    ];
  },
  createTestTurns() {
    return [
      {
        id: 1,
        roll: 8,
        skip: false,
        use_hint: false,
        id_game: 1,
        id_card: 1
      },
      {
        id: 2,
        roll: null,
        skip: true,
        use_hint: false,
        id_game: 1,
        id_card: 5
      },
      {
        id: 3,
        roll: 10,
        skip: false,
        use_hint: true,
        id_game: 1,
        id_card: 3
      },
      {
        id: 4,
        roll: null,
        skip: false,
        use_hint: false,
        id_game: 1,
        id_card: 4
      },
    ];
  },
  createTestCards() {
    return [
      {
        id: 1,
        alt_text: 'the letter alef with background',
        id_question: 1,
        id_answer: 1,
        difficulty: 1
      },
      {
        id: 2,
        alt_text: 'the letter dales with background',
        id_question: 1,
        id_answer: 2,
        difficulty: 1
      },
      {
        id: 3,
        alt_text: 'the letter gimel with background',
        id_question: 1,
        id_answer: 3,
        difficulty: 1
      },
      {
        id: 4,
        alt_text: 'the letter hey with background',
        id_question: 1,
        id_answer: 4,
        difficulty: 1
      },
      {
        id: 5,
        alt_text: 'the word "meynen" with background',
        id_question: 2,
        id_answer: 5,
        difficulty: 2
      },
      {
        id: 6,
        alt_text: 'the word "geyn" with background',
        id_question: 2,
        id_answer: 6,
        difficulty: 2
      },
      {
        id: 7,
        alt_text: 'the word "lernen" with background',
        id_question: 2,
        id_answer: 7,
        difficulty: 2
      },
      {
        id: 8,
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
        id: 1,
        question_text: 'what is the name of this letter'
      },
      {
        id: 2,
        question_text: 'what does this word mean?'
      }
    ];

  },
  createTestAnswers() {
    return [
      {
        id: 1,
        answer_text: 'alef'
      },
      {
        id: 2,
        answer_text: 'dales'
      },
      {
        id: 3,
        answer_text: 'gimel'
      },
      {
        id: 4,
        answer_text: 'hey'
      },
      {
        id: 5,
        answer_text: 'to think'
      },
      {
        id: 6,
        answer_text: 'to go'
      },
      {
        id: 7,
        answer_text: 'to learn'
      },
      {
        id: 8,
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
  }
};