import crypto from 'crypto';
import { getConfigInConfigScriptDir } from '../../../config';
import log from './lib/log';
import { connect } from './lib/database';
import graphqlServer from './graphql-server';
import storage from './lib/storage';
import staticServer from '../../static-server/src/static-server';
import stop from './stop';

(async () => {
  const config = await getConfigInConfigScriptDir('api-server.toml');
  storage.setStorageRoot(config.storage.root);
  storage.setCoursesPath(config.storage.courses);
  storage.setResumeFile(config.storage.resume);
  storage.setSecretKey(crypto.randomBytes(16).toString('hex'));

  await connect(config.database);

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
