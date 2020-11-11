const createNewGame = async function (db, userId, newGame) {
  const result = await db.into('game')
    .insert({ ...newGame, id_user: userId })
    .returning('*')
    console.log('servuce',result[0].id)
  return result[0].id;
}

const getGameSettingsByUser = async function (db, userId) {
  const game = await db
    .select('*')
    .from('game')
    .where('id_user', userId)
    .first();
  return game;
}

const getGameTurnsByUser = async function (db, userId) {
  const turns = await db
    .select('turn.*')
    .from('game')
    .where('id_user', userId)
    .join('turn', function() { 
      this.on('turn.id_game', '=', 'game.id')
    })
  
  return turns;
}
module.exports = {
  getGameTurnsByUser,
  getGameSettingsByUser, 
  createNewGame
}