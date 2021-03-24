require('dotenv').config();
const knex = require('knex');

const { NODE_ENV, PORT, DB_CONNECTION } = require('./config');
const app = require('./app');

app.set(
  'db',
  knex(
    {
      client: 'pg',
      connection: DB_CONNECTION
    }
  )
);

console.log(DB_CONNECTION);
console.log(app.get('db'));

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server started in ${NODE_ENV} mode on ${PORT}...`));