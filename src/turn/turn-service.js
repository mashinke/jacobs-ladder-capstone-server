const createTurn = async function (db, newTurn) {
  console.log(newTurn)
  const result = await db.into('turn')
    .insert({ ...newTurn })
  return;
}

module.exports = {createTurn}