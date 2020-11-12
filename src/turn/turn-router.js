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

      let lastTurn = await GameService.checkGameLastTurnByUser(db, req.userId)

      if (!lastTurn) {
        // validate
        if (!cardId) return res.status(400).json({ message: 'cardId required' });
        if (skipCard && !answer) {
          return
          res.status(400).json({ message: 'answer required for skipCard' });
        }
        if (!useHint && !answer)
          return res.status(400).json({ message: 'either hint or answer required' });
      } else if (!answer) {
        res.status(400).json({ message: 'answer required for skipCard' });
      }

      // get the active game
      const id_game = await gameService.getActiveGameIdByUser(db, req.userId)


      // build turn object
      const id_card = cardId;
      const use_hint = useHint;
      const skip_attempt = skipCard;
      const correctAnswer = await cardService.getAnswer(db, id_card);
      let last_turn = lastTurn;
      let gameWon;
      let roll;
      let skip_success;

      if (!lastTurn) {
        if (!use_hint) {
          if (correctAnswer === answer) {
            if (skip_attempt) {
              skip_success = true;
            } else {
              roll = rollDie();
            }
          }
        } else {
          roll = rollDie();
        }
      } else {
        if (correctAnswer === answer) {
          GameService.winActiveGameByUser(db, req.userId);
          gameWon = true;
        }
      }



      if (!lastTurn) {
        // check final position
        const gameSettings = await GameService.getActiveGameSettingsByUser(db, req.userId);
        const gameTurns = await GameService.getActiveGameTurnsByUser(db, req.userId);
        let position = gameTurns.reduce((total, currentTurn) => {
          if (currentTurn.skip_success) {
            total = total + gameSettings.stage_size;
          }
          else if (currentTurn.roll) {
            total = total + currentTurn.roll;
          }
          return total;
        }, 0);

        if (roll) position += roll;
        if (skip_success) position += gameSettings.stage_size;

        const finalPosition = gameSettings.total_stages * gameSettings.stage_size;

        console.log(position, finalPosition)

        if (position >= finalPosition) {
          await GameService.flagGameLastTurnByUser(db, req.userId)
          lastTurn = true;
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

      return res.status(200).json({
        roll,
        correctAnswer,
        useHint,
        lastTurn,
        skipSuccess: skip_success,
        gameWon
      });
    }
    catch (err) { next(err) }
  })

module.exports = turnRouter;