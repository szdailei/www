import postgres from 'postgres';
import log from './lib/log';
import storage from './lib/storage';

async function connectToDatabase(options) {
  storage.setSql(postgres(options));

  log.warn(`Connect to postgres server to ${options.host}:${options.port}`);
}

export default connectToDatabase;
