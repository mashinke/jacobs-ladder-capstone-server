const express = require('express');
const cardService = require('../card/card-service');
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
      const { gameId, cardId, answer, skipCard, useHint } = req.body;
      // validate
      if (!gameId) return res.status(400).json({ message: 'gameId required' });

      const gameStatus = await GameService.checkGameIsActive(db, gameId);
      if (gameStatus === undefined)
        return res
          .status(404)
          .json({ message: `can't find game with id ${gameId}` })
      if (!gameStatus.active)
        return res
          .status(400)
          .json({ message: `game with id ${gameId} is not active` })

      if (!cardId) return res.status(400).json({ message: 'cardId required' });
      if (skipCard && !answer) {
        return
          res.status(400).json({ message: 'answer required for skipCard' });
      }
      if (!useHint && !answer)
        res.status(400).json({ message: 'either hint or answer required' });
      // build turn object
      const id_card = cardId;
      const id_game = gameId;
      const use_hint = useHint;
      const skip_attempt = skipCard;

      let roll;
      let skip_success;

      if (use_hint) {
        roll = rollDie();
      }

      else {
        const correct = await cardService.checkAnswer(db, id_card, answer) > 0;
        if (correct) {
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
      console.log(turn)
      await TurnService.createTurn(db, turn);
      return res.status(204).send();
    }
    catch (err) { next(err) }
  })

module.exports = turnRouter;