/**
 * Knex configuration file.
 * Reads the DATABASE_URL environment variable for the PostgreSQL connection.
 */

const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '../../migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../../seed')
    }
  },

  // Additional environments (test, production) can be added here.
};