const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || '';
const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || process.env.DB_HOST === 'localhost';
const useSSL = (process.env.NODE_ENV === 'production' || dbUrl.includes('render.com')) && !isLocal;

const sequelize = new Sequelize(
  dbUrl || 
    `postgres://${process.env.DB_USER || 'fundrise'}:${process.env.DB_PASSWORD || 'fundrise_pass'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'fundrise'}`,
  {
    dialect: 'postgres',
    dialectOptions: {
      ...(useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {}),
    },
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully');
    
    // Sync all models with database
    // { alter: true } will add new columns without dropping tables
    await sequelize.sync({ alter: true });
    console.log('Database Synced');
  } catch (error) {
    console.error('Database Connection Error:', error);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };