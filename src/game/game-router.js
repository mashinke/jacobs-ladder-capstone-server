const express = require('express');
const GameService = require('./game-service');
const jsonBodyParser = express.json();
const gameRouter = express.Router();

gameRouter
  .route('/')
  .post(jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db');
    try {
      if (!req.body) return res.status(400).send();
      const { gameLength, hintLimited, hintLimit } = req.body;

      // Validation
      if(!gameLength) return res.status(400).send();
      if(!hintLimit && !hintLimited) return res.status(400).send();
      if(hintLimited && hintLimit < 0) return res.status(400).send();

      const usedId = 1; // for now, default value
      const newGameId = await GameService.createNewGame(db, userId, {
        total_stages: gameLength,
        hint_limit: hintLimited ? true : false,
        max_hints: hintLimit
      })
      return res
        .status(201)
        .json({gameId: newGameId})
    }
    catch (err) { next(err) }
  })
  .get(async (req, res, next) => {
    const userId = 1 // for now, default value
    return res
      .status(200)
      .send();
  })

module.exports = gameRouter;