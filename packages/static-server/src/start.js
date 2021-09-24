import dotenv from 'dotenv-defaults';
import staticServer from './static-server.js';
import stop from './stop.js';

(async () => {
  await dotenv.config();

  const server = staticServer(process.env.PORT, process.env.WWW);

  function onExit(eventType) {
    stop(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onExit);
  });
})();
