const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || '';
const isLocal =
  dbUrl.includes('localhost') ||
  dbUrl.includes('127.0.0.1') ||
  dbUrl.includes('host.docker.internal') ||
  process.env.DB_HOST === 'localhost' ||
  process.env.DB_HOST === 'host.docker.internal';

const isInternalRender =
  dbUrl.includes('.render.internal') ||
  (dbUrl.includes('dpg-') && !dbUrl.includes('.render.com'));

const useSSL =
  process.env.DB_SSL === 'true' ||
  (!isLocal &&
    !isInternalRender &&
    (dbUrl.includes('render.com') ||
      dbUrl.includes('neon.tech') ||
      dbUrl.includes('supabase.co') ||
      (process.env.NODE_ENV === 'production' && !dbUrl.includes('sslmode=disable'))));

const isProduction = process.env.NODE_ENV === 'production';
const hasExternalPostgres =
  Boolean(dbUrl) ||
  (process.env.DB_HOST &&
    process.env.DB_HOST !== 'localhost' &&
    process.env.DB_HOST !== '127.0.0.1');

// Use SQLite if explicitly requested or if running in container without any DB url or remote DB host
const useSqlite =
  process.env.DB_DIALECT === 'sqlite' || (!hasExternalPostgres && isProduction);

let sequelize;

if (useSqlite) {
  const sqlitePath = path.resolve(__dirname, '../fundrise.sqlite');
  console.log(`[DB Config] Using SQLite database at: ${sqlitePath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false,
  });
} else {
  const connectionString =
    dbUrl ||
    `postgres://${process.env.DB_USER || 'fundrise'}:${process.env.DB_PASSWORD || 'fundrise_pass'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'fundrise'}`;

  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ...(useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {}),
    },
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

async function connectDB(maxAttempts = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[DB] Connecting to database (attempt ${attempt}/${maxAttempts})...`);
      await sequelize.authenticate();
      console.log(`✓ [DB] Connected successfully to ${sequelize.getDialect()}!`);

      console.log('[DB] Syncing database models...');
      await sequelize.sync({ alter: true });
      console.log('✓ [DB] Database schema synced.');
      return true;
    } catch (error) {
      console.warn(`[DB] Attempt ${attempt}/${maxAttempts} failed: ${error.message}`);
      if (attempt < maxAttempts) {
        console.log(`[DB] Retrying in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error('[DB] All database connection attempts failed.');
        return false;
      }
    }
  }
  return false;
}

module.exports = { sequelize, connectDB };