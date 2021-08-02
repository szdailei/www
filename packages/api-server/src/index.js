import http from 'http';
import dotenv from 'dotenv-defaults';
import init from './init.js';
import graphqlServer from './graphql-server.js';
import log from './lib/log.js';
import storage from './lib/storage.js';
import staticServer from '../../static-server/src/static-server.js';

(async () => {
  await dotenv.config();
  await init();

  http.createServer(graphqlServer).listen(process.env.API_SERVER_PORT);
  log.warn(`Start api server on http port ${process.env.API_SERVER_PORT}`);

  staticServer(process.env.DOWNLOAD_SERVER_PORT, storage.getDownloadRootDir());
  log.warn(`Start download server on http port ${process.env.DOWNLOAD_SERVER_PORT}`);
})();
