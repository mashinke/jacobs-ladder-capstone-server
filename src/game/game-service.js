const { response } = require("express");

const createNewGame = async function (db, userId, newGame) {
  // deactivate last game
  await db('game')
    .where('id_user', userId)
    .update({ active: false });
  const result = await db.into('game')
    .insert({ ...newGame, id_user: userId })
    .returning('*');
  return result[0].id;
}

const getGameSettingsByGame = async function (db, gameId) {
  const game = await db
    .select()
    .from('game')
    .where('id', gameId)
    .first();
  return game;
}

const getActiveGameSettingsByUser = async function (db, userId) {
  const game = await db
    .select('*')
    .from('game')
    .where('id_user', userId)
    .where({ active: true })
    .first();
  return game;
}

const getActiveGameTurnsByUser = async function (db, userId) {
  const turns = await db
    .select('turn.*')
    .from('game')
    .where('id_user', userId)
    .where({ active: true })
    .join('turn', function () {
      this.on('turn.id_game', '=', 'game.id')
    })

  return turns;
}

const checkGameLastTurnByUser = async function (db, userId) {
  const lastTurn = await db('game')
    .select('last_turn')
    .where('id_user', userId)
    .where('active', true)
    .where('ended', false)
    .first();
  return lastTurn.last_turn;
}

const getActiveGameIdByUser = async function (db, userId) {
  const game = await db('game')
    .select('id')
    .where('id_user', userId)
    .where('active', true)
    .first()
  return game.id;
}

const flagGameLastTurnByUser = async function (db, userId) {
  await db('game')
    .where('id_user', userId)
    .where('active', true)
    .update({ last_turn: true })
}

const winActiveGameByUser = async function (db, userId) {
  await db('game')
    .where('id_user', userId)
    .where('active', true)
    .update({ ended: true })
}

const getAllGameTurnsByUser = async (db, userId) => {
  const response = await db('game')
    .select('*')
    .where('id_user', userId)
    .join('turn', function () {
      this.on('turn.id_game', '=', 'game.id')
    });

  const games = response.reduce((acc, currentTurn) => {
    const gameId = currentTurn.id_game;
    if (!acc[gameId]) acc[gameId] = [currentTurn];
    else acc[gameId].push(currentTurn);
    return acc;
  }, {})

  return games;
}

const getAllGameIdsByUser = async (db, userId) => {
  const response = await db('game')
    .select('id')
    .where('id_user', userId)

  return response.map(game => game.id)
}

const reduceGameStateByGame = async (db, gameId) => {
  const gameSettings = await db('game')
    .select()
    .where('id', gameId)
    .first();
  const { stage_size } = gameSettings;
  const turns = await db('turn')
    .select()
    .where('id_game', gameId);
  return turns.reduce((total, currentTurn) => {
    total.turnNumber++
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
    turnNumber: 0,
    hintsUsed: 0,
    position: 0,
    successfulRolls: 0,
    totalRolls: 0,
    successfulSkips: 0,
    totalSkips: 0
  })
}

const reduceActiveGameStateByUser = async (db, userId) => {
  const activeGameId = await getActiveGameIdByUser(db, userId)
  const gameState = await reduceGameStateByGame(db, activeGameId);
  return gameState;
}



module.exports = {
  createNewGame,
  getActiveGameSettingsByUser,
  getGameSettingsByGame,
  getActiveGameTurnsByUser,
  checkGameLastTurnByUser,
  getActiveGameIdByUser,
  flagGameLastTurnByUser,
  winActiveGameByUser,
  getAllGameTurnsByUser,
  getAllGameIdsByUser,
  reduceGameStateByGame,
  reduceActiveGameStateByUser,
}