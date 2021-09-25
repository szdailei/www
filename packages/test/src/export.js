/* eslint-disable no-await-in-loop */
import { argv } from 'process';
import dotenv from 'dotenv-defaults';
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/node.js';
import config from './config.js';
import log from './lib/log.js';
import { exportPdf } from './lib/pdf.js';

const waitTillHTMLRendered = async (page, timeout = 5000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts < maxChecks) {
    const html = await page.content();
    const currentHTMLSize = html.length;

    const bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    log.info('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, ' body html size: ', bodyHTMLSize);

    if (lastHTMLSize !== 0 && currentHTMLSize === lastHTMLSize) countStableSizeIterations += 1;
    else countStableSizeIterations = 0;

    if (countStableSizeIterations >= minStableSizeIterations) {
      log.info('Page rendered fully..');
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
    checkCounts += 1;
  }
};

(async () => {
  await dotenv.config();

  if (argv.length < 3) {
    log.info(`Usage: yarn export https://example.com`);
    return;
  }

  const url = new URL(argv[2]);
  const params = url.hash.split('/');
  const fileName = params[params.length - 1];

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });

  const page = await browser.newPage();
  await page.goto(url, { timeout: 10000, waitUntil: 'load' });
  await waitTillHTMLRendered(page);

  await page.setViewport(config.VIEWPORT);
  await exportPdf(page, config, fileName, 1);
  await browser.close();
})();
