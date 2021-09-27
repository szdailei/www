import postgres from 'postgres';
import log from './log';
import storage from './storage';

async function connect(options) {
  storage.setSql(postgres(options));
  log.warn(`Connect to postgres server to ${options.host}:${options.port}`);
}

async function disconnect() {
  await storage.getSql().end({ timeout: 0 });
  log.warn(`Disconnected to postgres server`);
}

export { connect, disconnect };
