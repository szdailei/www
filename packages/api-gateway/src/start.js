import dotenv from 'dotenv-defaults';
import log from './lib/log.js';
import rules from './rules.js';
import reverseProxy from './reverse-proxy.js';
import stop from './stop.js';

(async () => {
  await dotenv.config();
  rules.init();

  const server = reverseProxy(process.env.API_GATEWAY_PORT);
  log.warn(`Start api gateway on http port ${process.env.API_GATEWAY_PORT}`);

  function onSignalTerm(eventType) {
    stop(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onSignalTerm);
  });
})();
