const createTurn = async function (db, newTurn, gameId) {
  const result = await db.into('turn')
    .insert({...newTurn, id_game: gameId})
    .returning('id')
  return result[0];
}

module.exports = {createTurn}