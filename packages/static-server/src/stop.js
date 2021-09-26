import log from './lib/log';

function exitProcess(code) {
  process.exit(code);
}

function onServerClosed() {
  log.warn('Static server closed');
  exitProcess(1);
}

function stop(eventType, server) {
  log.warn('%s received, stop static server ...', eventType);

  server.close(onServerClosed);
  setImmediate(() => {
    server.emit('close');
  });
}

export default stop;
