const express = require('express');
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
    const validateEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email);
    if (!validateEmail) {
      return res
        .status(400)
        .json({ error: 'please use a valid email address' });
    }
    const db = req.app.get('db');
    try {
      const emailTaken = await UserService.checkEmailTaken(db, email);
      if (emailTaken)
        return res
          .status(400)
          .json({ message: 'email already taken' });
      await UserService.registerUser(db, email, password);
      return res
        .status(200)
        .send();
    } catch (error) {
      next(error);
    }
  });

module.exports = userRouter;