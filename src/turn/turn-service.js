const createTurn = async function (db, newTurn) {
  const result = await db.into('turn')
    .insert({ ...newTurn })
  return;
}

module.exports = {createTurn}