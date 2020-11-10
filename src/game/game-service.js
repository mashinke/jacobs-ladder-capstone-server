const getGameByUser = async function (db, userId) {
  const result = await db('game')
    .select('*')
    .where('id_user', userId)
    .first()
  return result;
}
module.exports = {
  getGameByUser
}