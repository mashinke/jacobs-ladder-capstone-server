const { config } = require('dotenv');

require('dotenv').config();

configObject = {
  migrationsDirectory: 'migrations',
  driver: 'pg',
};

if(process.env.DATABASE_URL){
  configObject.connectionString = process.env.DATABASE_URL
} else {
  configObject.host = process.env.DB_HOST;
  configObject.database = ( process.env.NODE_ENV === 'test' )
    ? process.env.TEST_DB
    : process.env.DB;
  configObject.username = process.env.DB_USER;
  configObject.password = process.env.DB_PASS;
}

module.exports = configObject;