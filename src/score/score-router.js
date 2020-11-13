const express = require('express');
const GameService = require('../game/game-service')
const scoreRouter = express.Router();

scoreRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const db = req.app.get('db')
      const games = await GameService.getAllGameTurnsByUser(db, req.userId)

      const scores = Object.keys(games).map(currentGameId => {
        const currentGameTurns = games[currentGameId];
        const { total_stages, stage_size, ended, max_hints, hint_limit } = currentGameTurns[0];
        const { 
          hintsUsed, 
          successfulRolls, 
          totalRolls, 
          successfulSkips, 
          totalSkips 
        } = GameService.reduceGameState(currentGameTurns, stage_size)
        return {
          ended,
          stageSize: stage_size,
          totalStages: total_stages,
          hintsUsed,
          maxHints: hint_limit && max_hints,
          hintLimit: hint_limit,
          successfulRolls,
          totalRolls,
          successfulSkips,
          totalSkips
        }
      })

      return res
        .status(200)
        .json(scores);

    } catch (error) {
      next(error)
    }
})

module.exports = scoreRouter;