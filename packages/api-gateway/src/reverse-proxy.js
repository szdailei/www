import http from 'http';
import httpProxy from 'http-proxy';
import rules from './rules.js';

/**
@require res.headersSent is false
*/
function sendResponse(res, code, msg) {
  res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': msg.length });
  res.end(msg);
}

function handleProxyError(err, _, res) {
  sendResponse(res, 503, err.toString());
}

function requestHandler(req, res) {
  req.on('error', (err) => {
    if (res.headersSent) {
      res.end();
      return;
    }
    sendResponse(res, 400, err.toString());
  });

  if (res.headersSent) {
    res.end();
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    });
    res.end();
    return;
  }

  const target = rules.match(req.url);
  if (target) {
    const proxy = httpProxy.createProxyServer();
    proxy.on('error', handleProxyError);
    proxy.web(req, res, { target });
    return;
  }

  sendResponse(res, 501, http.STATUS_CODES[501]);
}

function reverseProxy(port) {
  if (!port) throw new Error('PORT is not set');

  const server = http.createServer();
  server.on('request', requestHandler);
  server.listen(port);
  return server;
}

export default reverseProxy;
