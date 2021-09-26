import crypto from 'crypto';
import getConfigInExecScriptPath from '../../../config';
import log from './lib/log';
import connectToDatabase from './connect-to-database';
import graphqlServer from './graphql-server';
import storage from './lib/storage';
import staticServer from '../../static-server/src/static-server';
import stop from './stop';

(async () => {
  storage.setSecretKey(crypto.randomBytes(16).toString('hex'));

  const config = await getConfigInExecScriptPath('api-server.toml');
  storage.setStorageRoot(config.storage.root);
  storage.setCoursesPath(config.storage.courses);
  storage.setResumeFile(config.storage.resume);

  const options = {
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    username: config.database.username,
    password: config.database.password,
    ssl: true,
  };

  await connectToDatabase(options);

  const gServer = graphqlServer(config['api-server'].port);
  log.warn(`api-server started on http port ${config['api-server'].port}`);

  const sServer = staticServer(config['static-server'].port, storage.getStorageRoot());
  log.warn(`static-server started on http port ${config['static-server'].port}`);

  function onSignalTerm(eventType) {
    stop(eventType, gServer, sServer);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
})();
