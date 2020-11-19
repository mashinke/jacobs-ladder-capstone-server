function shuffle(s) {
  for (let i = s.length - 1; i > 0; i--) {
    r = Math.floor(Math.random() * i);
    temp = s[r];
    s[r] = s[i];
    s[i] = temp;
  }
}
const getRandomCard = async function (db, difficulty, used = []) {
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
      this.on('card.id_question', '=', 'question.id')
    })
    .join('answer', function () {
      this.on('card.id_answer', '=', 'answer.id')
    })
  
  let stack;
  
  if(allCards.length !== used.length) {
    stack = allCards.filter(card => !used.includes(card.id))
  } else {
    stack = allCards;
  }

  shuffle(stack);
  const { answer_text:_, ...card } = stack[0];
  card.answers = stack.splice(0, 4).map(c => c.answer_text);
  shuffle(card.answers);
  return card;
}

const getAnswer = async function (db, cardId) {
  const result = await db('card')
    .select('answer.answer_text')
    .where('card.id', cardId)
    .join('answer', function () {
      this.on('card.id_answer', '=', 'answer.id')
    }).first();
    return result.answer_text;
}

module.exports = {
  getRandomCard,
  getAnswer
}