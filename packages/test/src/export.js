import { argv } from 'process';
import dotenv from 'dotenv-defaults';
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/node';
import config from './config';
import log from './lib/log';
import waitUtillHTMLRendered from './lib/wait-loaded';
import { exportPdf } from './lib/pdf';

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
    defaultViewport: config.DEFAULT_VIEWPORT,
  });

  const page = await browser.newPage();
  await page.goto(url, { timeout: 10000, waitUntil: 'load' });
  await waitUtillHTMLRendered(page);

  await exportPdf(page, fileName, 1);
  await browser.close();
})();
