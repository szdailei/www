import { getConfigInConfigScriptDir } from '../../../config';
import log from './lib/log';
import staticServer from './static-server';
import stop from './stop';

(async () => {
  const config = await getConfigInConfigScriptDir('static-server.toml');

  const server = staticServer(config['static-server'].port, config['static-server'].root);
  log.warn(`static-server started on http port ${config['static-server'].port}`);

  function onSignalTerm(eventType) {
    stop(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
})();
