require('dotenv').config();
const parse = require('pg-connection-string').parse;
const knex = require('knex');

const { NODE_ENV, PORT, DB_CONNECTION } = require('./config');
const app = require('./app');

const pgconfig = typeof DB_CONNECTION === 'string'
  ? parse(DB_CONNECTION)
  : DB_CONNECTION;

pgconfig.ssl = { rejectUnauthorized: false };

app.set(
  'db',
  knex(
    {
      client: 'pg',
      connection: pgconfig,
    }
  )
);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server started in ${NODE_ENV} mode on ${PORT}...`));