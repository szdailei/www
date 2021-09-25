import dotenv from '../../../dotenv.js';
import log from './lib/log.js';
import staticServer from './static-server.js';
import stop from './stop.js';

(async () => {
  await dotenv();

  const server = staticServer(process.env.PORT, process.env.WWW);
  log.warn(`Start static server on http port ${process.env.PORT}`);

  function onSignalTerm(eventType) {
    stop(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
})();
