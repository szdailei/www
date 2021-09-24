/* eslint-disable no-console */
function exitProcess(code) {
  process.exit(code);
}

function callback() {}

function closeServer(server) {
  server.close(callback);
  setImmediate(() => {
    server.emit('close');
  });
}

function end(eventType, graphqlServer, staticServer) {
  console.log('received end signal ', eventType);
  closeServer(graphqlServer);
  closeServer(staticServer);
  exitProcess(1);
}

export default end;
