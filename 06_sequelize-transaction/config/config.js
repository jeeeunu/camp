require('dotenv').config();
const env = process.env;

const development = {
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  database: env.RDS_DATABASE,
  host: env.RDS_HOSTNAME,
  dialect: env.RDS_DIALECT,
};

const test = {
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  database: env.RDS_DATABASE,
  host: env.RDS_HOSTNAME,
  dialect: env.RDS_DIALECT,
};

const production = {
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  database: env.RDS_DATABASE,
  host: env.RDS_HOSTNAME,
  dialect: env.RDS_DIALECT,
};

module.exports = { development, production, test };
