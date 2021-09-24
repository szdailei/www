import dotenv from 'dotenv-defaults';
import init from './init.js';
import graphqlServer from './graphql-server.js';
import storage from './lib/storage.js';
import staticServer from '../../static-server/src/static-server.js';
import end from './end.js';

(async () => {
  await dotenv.config();
  await init();

  const gServer = graphqlServer(process.env.API_SERVER_PORT);
  const sServer = staticServer(process.env.DOWNLOAD_SERVER_PORT, storage.getDownloadRootDir());

  function onExit(eventType) {
    end(eventType, gServer, sServer);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onExit);
  });
})();
