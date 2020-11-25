const bcrypt = require('bcrypt')

const registerUser = async (db, email, password) => {
  encryptedPass = await bcrypt.hash(password, 10);
  const response = await db
    .into('app_user')
    .insert({ email, password: encryptedPass })
    .returning('*')
  return response[0];

}

const checkEmailTaken = async (db, email) => {
  response = await db('app_user')
    .count('id')
    .where({ email })
    .first();
  return !!parseInt(response.count);
}
module.exports = { registerUser, checkEmailTaken }