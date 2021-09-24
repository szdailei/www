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

function stop(eventType, server) {
  console.log('received signal ', eventType);
  closeServer(server);
  exitProcess(1);
}

export default stop;
