const jwt = require('jsonwebtoken');
const config = require('../config');

async function validateJWT(req, res, next) {
  try {
    const authVal = req.get('Authorization') || '';
    if (!authVal.toLowerCase().startsWith('bearer ')) {
      return res
        .status(401).json({ message: 'authentication required' });
    }
    const token = authVal.split(' ')[1];
    const { sub: email } = jwt.verify(token, config.JWT_SECRET);
    const db = req.app.get('db');
    const result = await db('app_user')
      .select('id').where({ email }).first();
    if (!result) return res
      .status(401).json({ message: 'invalid credentials' });
    req.userId = result.id;
    next();
  } catch(error) {
    next(error);
  }
  
}

module.exports = validateJWT;