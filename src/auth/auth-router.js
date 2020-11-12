const express = require('express');
const path = require('path');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
  .route('/')
  .post(jsonBodyParser, async (req, res, next) => {
    const { email, password } = req.body;
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res
          .status(400)
          .json({ error: `${field} required` });
      }
    }
    const db = req.app.get('db');
    try {
      const token = await AuthService(db, email, password);
      if (token) {
        return res
          .status(200)
          .json({ token })
      }
      return res
        .status(401)
        .json({ error: 'invalid credentials' })
    } catch (error) {
      next(error)
    }
  });

module.exports = authRouter;