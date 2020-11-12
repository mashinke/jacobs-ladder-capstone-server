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
      const { totalStages, hintLimit, maxHints } = req.body;
      console.log(req.body)
      // Validation
      if (!totalStages) return res
        .status(400)
        .json({ message: 'totalStages is required' });
      if (!maxHints && hintLimit) return res
        .status(400)
        .json({ message: 'maxHints required if hintLimit is true' });
      if (hintLimit && maxHints < 0) return res
        .status(400)
        .json({ message: 'negative numbers not allowed for maxHints' });

      const newGameId = await GameService.createNewGame(db, req.userId, {
        total_stages: totalStages,
        hint_limit: hintLimit ? true : false,
        max_hints: maxHints
      })
      return res
        .status(201)
        .json({ gameId: newGameId })
    }
    catch (err) { next(err) }
  })
  .get(async (req, res, next) => {
    const db = req.app.get('db')

    const response = {};
    const gameSettings = await GameService.getActiveGameSettingsByUser(db, req.userId);
    const gameTurns = await GameService.getActiveGameTurnsByUser(db, req.userId);

    // different naming schemes for db and API...
    const {
      id,
      max_hints,
      hint_limit,
      total_stages,
      stage_size,
      last_turn,
      ended
    } = gameSettings;

    response.gameSettings = {
      gameId: id,
      maxHints: max_hints,
      hintLimit: hint_limit,
      totalStages: total_stages,
      stageSize: stage_size,
      lastTurn: last_turn,
      ended
    };

    response.gameState = {};
    let rC = null;
    // only do this on a regular turn
    if (!response.gameState.lastTurn) {
      rC = await cardService.getRandomCard(db, 1);
    }
    // we get a skip card anyway
    const sC = await cardService.getRandomCard(db, 2);

    // different naming schemes...
    if (!last_turn) {
      response.rollCard = {
        id: rC.id,
        altText: rC.alt_text,
        questionText: rC.question_text,
        answers: rC.answers
      };
    };

    response.skipCard = {
      id: sC.id,
      altText: sC.alt_text,
      questionText: sC.question_text,
      answers: sC.answers
    };

    response.gameState.turnNumber = gameTurns.length + 1;

    // Now if there have been turns already, put in the rest of the info

    if (gameTurns.length !== 0) {
      const roll = Math.floor(Math.random() * 10);

      Object.assign(response.gameState,
        gameTurns.reduce((total, currentTurn) => {
          if (currentTurn.use_hint) total.hintsUsed++;
          if (currentTurn.skip_attempt) {
            total.totalSkips++;
            if (currentTurn.skip_success) {
              total.position = total.position + stage_size;
              total.successfulSkips++;
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