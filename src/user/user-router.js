const express = require('express');
const path = require('path');
const UserService = require('./user-service');

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter
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
      const emailTaken = await UserService.checkEmailTaken(db, email)
      console.log(emailTaken)
      if (emailTaken)
        return res
          .status(400)
          .json({ message: 'email already taken' })
      const user = await UserService.registerUser(db, email, password);
      return res
        .status(200)
        .send();
    } catch (error) {
      next(error)
    }
  });

module.exports = userRouter;