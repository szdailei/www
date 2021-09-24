import dotenv from 'dotenv-defaults';
import rules from './rules.js';
import reverseProxy from './reverse-proxy.js';
import end from './end.js';

(async () => {
  await dotenv.config();
  rules.init();

  const server = reverseProxy(process.env.API_GATEWAY_PORT);
  function onExit(eventType) {
    end(eventType, server);
  }

  ['SIGINT', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, onExit);
  });
})();
