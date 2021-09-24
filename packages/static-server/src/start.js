import dotenv from 'dotenv-defaults';
import staticServer from './static-server.js';
import end from './end.js';

(async () => {
  await dotenv.config();

  const server = staticServer(process.env.PORT, process.env.WWW);

  function onExit(eventType) {
    end(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onExit);
  });
})();
