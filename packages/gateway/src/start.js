import { getConfigInConfigScriptDir } from '../../../config';
import log from './lib/log';
import rules from './rules';
import reverseProxy from './reverse-proxy';
import stop from './stop';

(async () => {
  const config = await getConfigInConfigScriptDir('gateway.toml');
  rules.init(config['api-server'].endpoint);

  const server = reverseProxy(config.gateway.port);
  log.warn(`gateway started on http port ${config.gateway.port}`);

  function onSignalTerm(eventType) {
    stop(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
})();
