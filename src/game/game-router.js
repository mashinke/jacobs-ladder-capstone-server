const express = require('express');
const cardService = require('../card/card-service');
const GameService = require('./game-service');
const jsonBodyParser = express.json();
const gameRouter = express.Router();

function shuffle(s) {
  for (let i = s.length - 1; i > 0; i--) {
    r = Math.floor(Math.random() * i);
    temp = s[r];
    s[r] = s[i];
    s[i] = temp;
  }
}

gameRouter
  .route('/')
  .post(jsonBodyParser, async (req, res, next) => {
    // console.log('POST game/')
    // here we are setting up a new game using settings from the client.
    const db = req.app.get('db');
    try {
      if (!req.body) return res.status(400).send();
      const { totalStages, hintLimit, maxHints } = req.body;
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
    if (!gameSettings) {
      return res
        .status(200)
        .json({});
    }

    // const gameTurns = await GameService.getActiveGameTurnsByUser(db, req.userId);

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

    // now we have what we need to reduce the game state
    response.gameState =
      await GameService.reduceActiveGameStateByUser(db, req.userId);

    response.gameState.turnNumber++;
    
    const usedSkipCards = 
      await GameService.makeActiveGameUsedCardPileByUser(db, req.userId, true)

    let rC = null;
    // only do this on a regular turn
    if (!last_turn) {
      const usedRollCards = await GameService.makeActiveGameUsedCardPileByUser(db, req.userId, false)
      rC = await cardService.getRandomCard(db, 1, usedRollCards);
    }
    // we get a skip card anyway
    const sC = await cardService.getRandomCard(db, 2, usedSkipCards);

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

    return res
      .status(200)
      .json(response);
  })

module.exports = gameRouter;