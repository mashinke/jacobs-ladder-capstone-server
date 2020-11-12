const express = require('express');
const cardService = require('../card/card-service');
const gameService = require('../game/game-service');
const GameService = require('../game/game-service');
const TurnService = require('./turn-service');
const jsonBodyParser = express.json();
const turnRouter = express.Router();

function rollDie() {
  return Math.ceil(Math.random() * 10)
}

turnRouter
  .route('/')
  .post(jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db');
    try {
      if (!req.body) return res.status(400).send();
      const { cardId, answer, skipCard, useHint } = req.body;
      
      // validate
      if (!cardId) return res.status(400).json({ message: 'cardId required' });
      if (skipCard && !answer) {
        return
          res.status(400).json({ message: 'answer required for skipCard' });
      }
      if (!useHint && !answer)
        res.status(400).json({ message: 'either hint or answer required' });

      // get the active game
      const id_game = await gameService.getActiveGameIdByUser(db, req.userId)
      console.log(id_game)

      // build turn object
      const id_card = cardId;
      const use_hint = useHint;
      const skip_attempt = skipCard;
      const correctAnswer = await cardService.getAnswer(db, id_card);

      let roll;
      let skip_success;

      if (use_hint) {
        roll = rollDie();
      }

      else {
        if (correctAnswer === answer) {
          console.log('correct answer', correctAnswer)
          if (skip_attempt) {
            skip_success = true;
          } else {
            roll = rollDie();
          }
        }
      }

      const turn = {
        roll,
        skip_attempt,
        skip_success,
        use_hint,
        id_card,
        id_game
      }
      await TurnService.createTurn(db, turn);
      console.log('about to sent', correctAnswer)
      return res.status(200).json({ 
        roll,
        correctAnswer, 
        useHint, 
        skipAttempt: skipCard
      });
    }
    catch (err) { next(err) }
  })

module.exports = turnRouter;