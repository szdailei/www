import log from './lib/log';
import storage from './lib/storage';

let isGraphqlServerClosed = false;
let isStaticServerClosed = false;
let isPostgresServerDisconnected = false;

function exitProcess(code) {
  if (isGraphqlServerClosed && isStaticServerClosed && isPostgresServerDisconnected) process.exit(code);
}

function onGraphqlServerClosed() {
  log.warn('Graphql server closed');
  isGraphqlServerClosed = true;
  exitProcess(1);
}

function onStaticServerClosed() {
  log.warn('Static server closed');
  isStaticServerClosed = true;
  exitProcess(1);
}

async function stop(eventType, graphqlServer, staticServer) {
  log.warn('%s received, stop api server and static server ...', eventType);

  graphqlServer.close(onGraphqlServerClosed);
  staticServer.close(onStaticServerClosed);
  setImmediate(() => {
    graphqlServer.emit('close');
    staticServer.emit('close');
  });

  await storage.getSql().end({ timeout: 0 });
  log.warn(`Disconnected to postgres server`);
  isPostgresServerDisconnected = true;
  exitProcess(1);
}

export default stop;
