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


      const newGameId = await GameService.createNewGame(db, 1, {
        total_stages: gameLength,
        hint_limit: hintLimited ? true : false,
        max_hints: hintLimit
      }) // for now, default to id_user = 1
      return res
        .status(201)
        .json({gameId: newGameId})
    }
    catch (err) { next(err) }
  })

module.exports = gameRouter;