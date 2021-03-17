require('dotenv').config();
const {expect} = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;

global.dbConnection = {
  host: process.env.DB_HOST,
  database: process.env.TEST_DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
}
