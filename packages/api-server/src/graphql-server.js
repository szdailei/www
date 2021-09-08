import { graphql } from 'graphql/index.mjs';
import { schema, resolvers } from './graphql-loader.js';

function graphqlServer(req, res) {
  req.on('error', (err) => {
    if (res.headersSent) {
      res.end();
      return;
    }
    res.writeHead(400);
    res.end(err.toString());
  });

  if (req.method !== 'POST') {
    res.writeHead(501);
    res.end();
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    const json = JSON.parse(body);
    if (!json || !json.query) {
      const MISS_JSON_OR_QUERY = 'Miss json or "query" token in body';
      res.writeHead(400);
      res.end(MISS_JSON_OR_QUERY);
      return;
    }
    const result = await graphql(schema, json.query, resolvers, req);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    const resBody = JSON.stringify(result);
    res.end(resBody);
  });
}

export default graphqlServer;
