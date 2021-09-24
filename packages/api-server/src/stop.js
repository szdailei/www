import config from './config.js';

/* eslint-disable no-console */
let isGraphqlServerExit = false;
let isStaticServerExit = false;

function exitProcess(code) {
  if (isGraphqlServerExit && isStaticServerExit) process.exit(code);
}

function exitGraphqlServer() {
  console.log('Graphql server closed');
  isGraphqlServerExit = true;
  exitProcess(1);
}

function exitStaticServer() {
  console.log('Static server closed');
  isStaticServerExit = true;
  exitProcess(1);
}

async function end(eventType, graphqlServer, staticServer) {
  console.log('Received signal %s, stop api server and static server ...', eventType);

  graphqlServer.close(exitGraphqlServer);
  staticServer.close(exitStaticServer);
  setImmediate(() => {
    graphqlServer.emit('close');
    staticServer.emit('close');
  });

  console.log(`Teardown postgres server`);
  await config.sql.end({ timeout: 0 });
}

export default end;
