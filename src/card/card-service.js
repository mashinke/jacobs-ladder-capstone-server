const GameService = require('../game/game-service');

function shuffle(s) {
  for (let i = s.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * i);
    const temp = s[r];
    s[r] = s[i];
    s[i] = temp;
  }
}
const getRandomCard = async function (db, userId, skipCard = false) {
  // TODO: try this: create a getAllCards function, try to filter used cards in 
  //the join statement, if there are less than 4 results run the query again
  // without used cards?

  const difficulty = skipCard ? 2 : 1; // for now hardcode just two
  const used = await makeActiveGameUsedCardPileByUser(db, userId, skipCard);
  let allCards = await db('card')
    .select(
      'card.id',
      'card.alt_text',
      'question.question_text',
      'answer.answer_text')
    .where(
      'card.difficulty',
      difficulty)
    .join('question', function () {
      this.on('card.id_question', '=', 'question.id');
    })
    .join('answer', function () {
      this.on('card.id_answer', '=', 'answer.id');
    });

  let stack;

  if (allCards.length >= used.length + 4) {
    stack = allCards.filter(card => !used.includes(card.id));
  } else {
    stack = allCards;
  }

  shuffle(stack);

  const { answer_text, ...card } = stack[0];
  card.answers = stack.slice(1, 4).map(c => c.answer_text);
  card.answers.push(answer_text);
  shuffle(card.answers);
  return card;
};

const getAnswer = async function (db, cardId) {
  const result = await db('card')
    .select('answer.answer_text')
    .where('card.id', cardId)
    .join('answer', function () {
      this.on('card.id_answer', '=', 'answer.id');
    }).first();
  return result.answer_text;
};

const makeActiveGameUsedCardPileByUser = async (db, userId, skipCard = false) => {
  const turns = await GameService.getActiveGameTurnsByUser(db, userId);

  return turns.reduce((total, currTurn) => {
    if (!currTurn.skip_attempt === skipCard) return total;
    if (total.find(card => card === currTurn.id_card)) {
      return [currTurn.id_card];
    }
    return [...total, currTurn.id_card];
  }, []);
};

module.exports = {
  getRandomCard,
  getAnswer,
  makeActiveGameUsedCardPileByUser
};