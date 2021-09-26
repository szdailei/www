import getConfigInExecScriptPath from '../../../config';
import log from './lib/log';
import staticServer from './static-server';
import stop from './stop';

(async () => {
  const config = await getConfigInExecScriptPath('static-server.toml');

  const server = staticServer(config.staticServer.port, config.staticServer.root);
  log.warn(`Start static server on http port ${config.staticServer.port}`);

  function onSignalTerm(eventType) {
    stop(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
})();
