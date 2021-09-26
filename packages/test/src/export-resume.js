import dotenv from 'dotenv-defaults';
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/node';
import config from './config';
import waitUtillHTMLRendered from './lib/wait-loaded';
import { exportPdf } from './lib/pdf';

(async () => {
  await dotenv.config();

  const fileName = 'resume';
  const format = { format: 'A4' };

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: config.DEFAULT_VIEWPORT,
  });

  const page = await browser.newPage();
  await page.goto(process.env.RESUME_PAGE, { timeout: 10000, waitUntil: 'load' });
  await waitUtillHTMLRendered(page);

  await exportPdf(page, fileName, 1, format);
  await browser.close();
})();
