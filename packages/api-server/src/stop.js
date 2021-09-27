import log from './lib/log';
import { disconnect } from './lib/database';

let isGraphqlServerClosed = false;
let isStaticServerClosed = false;
let isPostgresServerDisconnected = false;

function exitProcess(code) {
  if (isGraphqlServerClosed && isStaticServerClosed && isPostgresServerDisconnected) process.exit(code);
}

function onGraphqlServerClosed() {
  log.warn('api-server stoped');
  isGraphqlServerClosed = true;
  exitProcess(1);
}

function onStaticServerClosed() {
  log.warn('static-server stoped');
  isStaticServerClosed = true;
  exitProcess(1);
}

async function stop(eventType, graphqlServer, staticServer) {
  log.warn('%s received, api-server and static-server stoping ...', eventType);

  graphqlServer.close(onGraphqlServerClosed);
  staticServer.close(onStaticServerClosed);
  setImmediate(() => {
    graphqlServer.emit('close');
    staticServer.emit('close');
  });

  await disconnect();
  isPostgresServerDisconnected = true;
  exitProcess(1);
}

export default stop;
