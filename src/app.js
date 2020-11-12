const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./errorhandler');
const gameRouter = require('./game/game-router');
const { NODE_ENV } = require('./config');
const turnRouter = require('./turn/turn-router');

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const app = express();

app.use(cors());
app.use(morgan(morganOption));
app.use(helmet());

app.use('/api', (req, res, next) => {
  req.userId = 1; // temporary default setting
  next();
});

app.use('/api/game', gameRouter );
app.use('/api/turn', turnRouter );

app.use(errorHandler);

module.exports = app;
