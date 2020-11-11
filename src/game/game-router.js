const express = require('express');
const cardService = require('../card/card-service');
const GameService = require('./game-service');
const jsonBodyParser = express.json();
const gameRouter = express.Router();

gameRouter
  .route('/')
  .post(jsonBodyParser, async (req, res, next) => {
    // here we are setting up a new game using settings from the client.
    const db = req.app.get('db');
    try {
      if (!req.body) return res.status(400).send();
      const { gameLength, hintLimited, hintLimit } = req.body;

      // Validation
      if (!gameLength) return res.status(400).send();
      if (!hintLimit && !hintLimited) return res.status(400).send();
      if (hintLimited && hintLimit < 0) return res.status(400).send();

      const usedId = 1; // for now, default value
      const newGameId = await GameService.createNewGame(db, userId, {
        total_stages: gameLength,
        hint_limit: hintLimited ? true : false,
        max_hints: hintLimit
      })
      return res
        .status(201)
        .json({ gameId: newGameId })
    }
    catch (err) { next(err) }
  })
  .get(async (req, res, next) => {
    const db = req.app.get('db')
    const userId = 1 // for now, default value

    const response = {};
    const gameSettings = await GameService.getGameSettingsByUser(db, userId);
    const gameTurns = await GameService.getGameTurnsByUser(db, userId);

    // different naming schemes for db and API...
    const {
      id_game,
      max_hints,
      total_stages,
      stage_size,
      ended
    } = gameSettings;

    response.gameSettings = {
      gameId: id_game,
      maxHints: max_hints,
      totalStages: total_stages,
      stageSize: stage_size,
      ended
    };

    response.gameState = {};
    response.rollCard = await cardService.getRandomCard(db, 1);
    response.skipCard = await cardService.getRandomCard(db, 2);
    response.gameState.turnNumber = gameTurns.length + 1;
    // that's it for a new game. 

    // Now if there have been turns already, put in the rest of the info
    if (gameTurns.length !== 0) {
      const roll = Math.floor(Math.random() * 10);
      const hintsUsed = gameTurns.reduce((total, currentTurn) => {
        if (currentTurn.use_hint) total++;
        return total;
      }, 0)
      const position = gameTurns.reduce((total, currentTurn) => {
        const increment = currentTurn.skip ? stage_size : currentTurn.roll;
        total = increment ? total + increment : total;
        return total;
      }, 0)

      Object.assign(response.gameState,
        gameTurns.reduce((total, currentTurn) => {
          if (currentTurn.use_hint) total.hintsUsed++;
          if (currentTurn.skip_attempt) {
            if (currentTurn.skip_success) {
              total.position = total.position + stage_size;
              total.successfulSkips++;
              total.totalSkips++;
            }
          } else {
            total.totalRolls++;
            if (currentTurn.roll) {
              total.position = total.position + currentTurn.roll;
              total.successfulRolls++;
            }
          }
          return total;
        }, {
          hintsUsed: 0,
          position: 0,
          successfulRolls: 0,
          totalRolls: 0,
          successfulSkips: 0,
          totalSkips: 0
        })
      );
    }

    return res
      .status(200)
      .json(response);
  })

module.exports = gameRouter;