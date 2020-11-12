function shuffle(s) {
  for (let i = s.length - 1; i > 0; i--) {
    r = Math.floor(Math.random() * i);
    temp = s[r];
    s[r] = s[i];
    s[i] = temp;
  }
}
const getRandomCard = async function (db, difficulty) {
  let stack = await db('card')
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

  shuffle(stack);
  const { answer_text:_, ...card } = stack[0];
  card.answers = stack.splice(0, 4).map(c => c.answer_text);
  shuffle(card.answers);
  return card;
}

const checkAnswer = async function (db, cardId, answer) {
  const result = await db('card')
    .count()
    .where('card.id', cardId)
    .where('answer.answer_text', answer)
    .join('answer', function () {
      this.on('card.id_answer', '=', 'answer.id')
    }).first();
    console.log(result.count)
    return result.count;
}

module.exports = {
  getRandomCard,
  checkAnswer
}