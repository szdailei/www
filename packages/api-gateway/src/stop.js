import log from './lib/log.js';

function exitProcess(code) {
  process.exit(code);
}

function onServerClosed() {
  log.warn('Api gateway closed');
  exitProcess(1);
}

function stop(eventType, server) {
  log.warn('%s received, stop api gateway ...', eventType);

  server.close(onServerClosed);
  setImmediate(() => {
    server.emit('close');
  });
}

export default stop;
