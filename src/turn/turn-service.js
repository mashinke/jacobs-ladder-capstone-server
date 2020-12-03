const createTurn = async function (db, newTurn) {
  await db.into('turn')
    .insert({ ...newTurn });
  return;
};

module.exports = { createTurn };