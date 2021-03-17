require("dotenv").config();

const {
  NODE_ENV,
  PORT,
  API_TOKEN,
  JWT_SECRET,
  DATABASE_URL,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB,
} = process.env;

configObject = {
  NODE_ENV,
  PORT,
  API_TOKEN,
  JWT_SECRET,
  DB_CONNECTION: DATABASE_URL
  || {
    host: DB_HOST,
    database: DB,
    user: DB_USER,
    password: DB_PASS,
  }
}

console.log(configObject);

module.exports = configObject;
