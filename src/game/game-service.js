const createNewGame = async function (db, userId, newGame) {
  // deactivate last game
  await db('game')
    .where('id_user', userId)
    .update({ active: false })

  const result = await db.into('game')
    .insert({ ...newGame, id_user: userId })
    .returning('*')
  return result[0].id;
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

const checkGameIsActive = async function (db, gameId) {
  const gameStatus = await db('game')
    .select('active')
    .where('id', gameId)
    .first();
  console.log(gameStatus)
  return gameStatus;
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
  console.log('win game', userId)
  await db('game')
    .where('id_user', userId)
    .where('active', true)
    .update({ ended: true })
}

const getAllGameTurnsByUser = async (db, userId) => {
  response = await db('game')
    .select('*')
    .where('id_user', userId)
    .join('turn', function () {
      this.on('turn.id_game', '=', 'game.id')
    });
  console.log(response.length)

  const games = response.reduce((acc, currentTurn) => {
    const gameId = currentTurn.id_game;
    if(!acc[gameId]) acc[gameId] = [currentTurn];
    else acc[gameId].push(currentTurn);
    return acc;
  }, {})
  
  return games;
}

const reduceGameState = (turns, stage_size) => {
  return turns.reduce((total, currentTurn) => {
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
}

module.exports = {
  getActiveGameTurnsByUser,
  getActiveGameSettingsByUser,
  createNewGame,
  checkGameIsActive,
  checkGameLastTurnByUser,
  getActiveGameIdByUser,
  flagGameLastTurnByUser,
  winActiveGameByUser,
  reduceGameState,
  getAllGameTurnsByUser
}