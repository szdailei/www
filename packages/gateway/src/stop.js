import log from './lib/log';

function exitProcess(code) {
  process.exit(code);
}

function onServerClosed() {
  log.warn('gateway stoped');
  exitProcess(1);
}

function stop(eventType, server) {
  log.warn('%s received, gateway stoping ...', eventType);

  server.close(onServerClosed);
  setImmediate(() => {
    server.emit('close');
  });
}

export default stop;
