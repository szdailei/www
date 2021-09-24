/* eslint-disable no-console */
function exitProcess(code) {
  process.exit(code);
}

function exit() {
  console.log('Api gateway closed');
  exitProcess(1);
}

function end(eventType, server) {
  console.log('Received signal %s, stop api gateway ...', eventType);

  server.close(exit);
  setImmediate(() => {
    server.emit('close');
  });
}

export default end;
