/* eslint-disable no-console */
function exitProcess(code) {
  process.exit(code);
}

function exit() {
  console.log('Static server closed');
  exitProcess(1);
}

function stop(eventType, server) {
  console.log('Received signal %s, stop static server ...', eventType);

  server.close(exit);
  setImmediate(() => {
    server.emit('close');
  });
}

export default stop;
