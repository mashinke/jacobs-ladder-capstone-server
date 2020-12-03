const express = require('express');
const GameService = require('../game/game-service');
const scoreRouter = express.Router();

scoreRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const db = req.app.get('db');
      const gameIds = await GameService.getAllGameIdsByUser(db, req.userId);

      const scores = await Promise.all(
        gameIds.map(async currentGameId => {
          const currentGameSettings =
            await GameService.getGameSettingsByGame(db, currentGameId);
          const {
            total_stages,
            stage_size,
            ended,
            max_hints,
            hint_limit
          } = currentGameSettings;

          const currentGameState = await GameService.reduceGameStateByGame(db, currentGameId);

          const {
            hintsUsed,
            successfulRolls,
            totalRolls,
            successfulSkips,
            totalSkips,
            turnNumber,
            position
          } = currentGameState;

          return {
            ended,
            stageSize: stage_size,
            totalStages: total_stages,
            hintsUsed,
            maxHints: hint_limit ? max_hints : null,
            hintLimit: hint_limit,
            successfulRolls,
            totalRolls,
            successfulSkips,
            totalSkips,
            position,
            turnNumber
          };
        })
      );

      return res
        .status(200)
        .json(scores);

    } catch (error) {
      next(error);
    }
  });

module.exports = scoreRouter;