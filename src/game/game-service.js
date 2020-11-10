const createNewGame = async function (db, userId, newGame) {
  const result = await db.into('game')
    .insert({...newGame, id_user: userId})
    .returning('*')
  return result[0].id;
}

const getGameByUser = async function (db, userId) {
  const result = await db('game')
    .select('*')
    .where('id_user', userId)
    .first()
  return result;
}
module.exports = {
  getGameByUser,
  createNewGame
}