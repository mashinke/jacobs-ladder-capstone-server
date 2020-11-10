const createNewGame = async function (db, userId, newGame) {
  const result = await db.into('game')
    .insert({ ...newGame, id_user: userId })
    .returning('*')
  return result[0].id;
}

const getGameByUser = async function (db, userId) {
  const turns = await db
    .select('turn.*')
    .from('game')
    .where('id_user', userId)
    .join('turn', function() { 
      this.on('turn.id_game', '=', 'game.id')
    })
  const game = await db
    .select('*')
    .from('game')
    .where('id_user', userId)
    .first()
  
  const result = {
    game,
    turns
  }
  return result;
}
module.exports = {
  getGameByUser,
  createNewGame
}