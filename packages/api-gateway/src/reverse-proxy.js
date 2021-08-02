import http from 'http';
import httpProxy from 'http-proxy';
import rules from './rules.js';

function sendResponse(res, code, msg) {
  res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': msg.length });
  res.end(msg);
}

function handleProxyError(err, _, res) {
  sendResponse(res, 503, err.toString());
}

function reverseProxy(req, res) {
  req.on('error', (err) => {
    sendResponse(res, 400, err.toString());
  });

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

export default reverseProxy;
