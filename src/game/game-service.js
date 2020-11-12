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

const getGameSettingsByUser = async function (db, userId) {
  const game = await db
    .select('*')
    .from('game')
    .where('id_user', userId)
    .where({ active: true })
    .first();
  return game;
}

const getGameTurnsByUser = async function (db, userId) {
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
module.exports = {
  getGameTurnsByUser,
  getGameSettingsByUser,
  createNewGame,
  checkGameIsActive
}