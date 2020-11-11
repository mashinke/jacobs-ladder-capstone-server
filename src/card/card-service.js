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
    .select('*')
    .where('card.difficulty', difficulty)
    .join('question', function () {
      this.on('card.id_question', '=', 'question.id')
    })
    .join('answer', function () {
      this.on('card.id_answer', '=', 'answer.id')
    })

  shuffle(stack);
  const { _:answer_text, ...card } = stack[0];
  card.answers = stack.splice(0, 4).map(c => c.answer_text);
  shuffle(card.answers);
  return card;
}

const checkAnswer = async function (db, cardId, answer) {

}

module.exports = {
  getRandomCard,
  checkAnswer
}