import http from 'http';
import Table from 'cli-table';
import log from '../lib/log';
import targets from './targets';

function testOnce(target) {
  const headers = { 'Accept-Encoding': 'identity' };
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let throughput = 0;
    const req = http.get(target, { headers }, (res) => {
      res.on('data', (data) => {
        throughput += data.length;
      });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 400) {
          reject(new Error(`${target} statusCode ${res.statusCode}`));
        }
        if (res.statusCode >= 300 && res.statusCode < 400) {
          reject(new Error(`${target} statusCode ${res.statusCode}, redirect to ${res.headers.location}`));
        }
        const latency = Date.now() - startTime;
        resolve({ latency, throughput });
      });
    });
    req.on('error', (err) => {
      reject(new Error(`${target} has error ${err.toString()}`));
    });
  });
}

async function testDuration(target, duration) {
  const totalResult = {
    duration: 0,
    latencies: [],
    requests: 0,
    throughput: 0,
  };
  const startTime = Date.now();
  let actualDuration = 0;
  while (actualDuration < duration * 1000) {
    const result = await testOnce(target); // eslint-disable-line no-await-in-loop
    totalResult.latencies.push(result.latency);
    totalResult.requests += 1;
    totalResult.throughput += result.throughput / (1024 * 1024);
    actualDuration = Date.now() - startTime;
  }
  totalResult.duration = actualDuration / 1000;
  return totalResult;
}

function createDurationResult(host, results) {
  const durationResult = {
    host,
    status: 'Succ',
    requests: 0,
    throughput: 0,
  };
  const latencies = [];
  let totalActualDuration = 0;
  for (let i = 0; i < results.length; i += 1) {
    totalActualDuration += results[i].duration;
    durationResult.requests += results[i].requests;
    durationResult.throughput += results[i].throughput;
    for (let j = 0; j < results[i].latencies.length; j += 1) {
      latencies.push(results[i].latencies[j]);
    }
  }
  durationResult.duration = totalActualDuration / results.length;
  let sumLatency = 0;
  for (let i = 0; i < latencies.length; i += 1) {
    sumLatency += latencies[i];
  }
  durationResult.meanLatency = sumLatency / durationResult.requests;
  durationResult.maxLatency = Math.max(...latencies);
  return durationResult;
}

async function testOneTarget(target, duration, connections) {
  const iterator = [];
  for (let i = 0; i < connections; i += 1) {
    iterator.push(i);
  }
  const results = [];
  try {
    await Promise.all(
      iterator.map(async () => {
        const result = await testDuration(target, duration);
        results.push(result);
      })
    );
  } catch (err) {
    return {
      err,
      host: new URL(target).host,
      status: 'Fail',
      duration,
      maxLatency: 0,
      meanLatency: 0,
      requests: 0,
      throughput: 0,
    };
  }
  return createDurationResult(new URL(target).host, results);
}

function createTableRow(result) {
  const maxLatency = `${result.maxLatency.toFixed(1)} ms`;
  const meanLatency = `${result.meanLatency.toFixed(1)} ms`;
  const throughput = `${(result.throughput / result.duration).toFixed(1)} MB/s`;
  const requests = `${(result.requests / result.duration).toFixed(0)} /s`;
  return [result.host, result.status, maxLatency, meanLatency, throughput, requests];
}

async function testMultiTargets(duration, connections) {
  let summary = `Plan duration:${duration}s, Concurrent connections per site:${connections}\n`;
  const table = new Table({ head: ['Host', 'Status', 'Max-latency', 'Mean-latency', 'Throughput', 'Requests'] });
  await Promise.all(
    targets.map(async (target) => {
      const result = await testOneTarget(target, duration, connections);
      const row = createTableRow(result);
      table.push(row);
      if (result.err) {
        summary += `${result.err.toString()}\n`;
      }
    })
  );
  const output = `${summary}${table.toString()}`;
  log.warn(output);
}

export default testMultiTargets;
