import http from 'http';
import dotenv from 'dotenv-defaults';
import rules from './rules.js';
import log from './lib/log.js';
import reverseProxy from './reverse-proxy.js';

(async () => {
  await dotenv.config();
  rules.init();

  http.createServer(reverseProxy).listen(process.env.API_GATEWAY_PORT);
  log.warn(`Start api gateway on http port ${process.env.API_GATEWAY_PORT}`);
})();
