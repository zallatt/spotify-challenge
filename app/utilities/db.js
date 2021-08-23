const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const {
  database, user, password, host, port, dialect, pool,
} = dbConfig;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect,
  pool,
  operatorsAliases: 0,
});

module.exports = sequelize;
