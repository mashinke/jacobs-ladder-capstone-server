const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

async function authenticateLogin(db, email, password) {
  async function validateUserPass(email, clearPass) {
    const user = await db('app_user')
      .select()
      .where({ email })
      .first();
    if (!user) return null;
    const { password = '' } = user;
    return bcrypt.compare(clearPass, password)
      .then(valid => {
        if (valid) return user;
      });
  }
  const user = await validateUserPass(email, password);
  if (user) {
    const { id, email } = user;
    return generateJWT(email, id);
  }
}

function generateJWT(email, id) {
  return jwt.sign(
    { id, expiresIn: '7d' },
    config.JWT_SECRET,
    {
      subject: email,
      algorithm: 'HS256'
    });
}

module.exports = authenticateLogin;