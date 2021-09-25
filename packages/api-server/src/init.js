import crypto from 'crypto';
import postgres from 'postgres';
import log from './lib/log.js';
import config from './config.js';

async function init() {
  config.secretKey = crypto.randomBytes(16).toString('hex');

  const options = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: true,
  };

  config.sql = postgres({ ...options });
  log.warn(`Connect to postgres server to ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`);
}

export default init;
