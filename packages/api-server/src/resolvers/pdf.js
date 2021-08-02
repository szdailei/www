import puppeteer from 'puppeteer-core/lib/esm/puppeteer/node.js';
import storage from '../lib/storage.js';

async function generatePdf(htmlPageUrl, accpetLanguage) {
  const LOADED_TAG = 'article';

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': accpetLanguage,
  });
  await page.goto(htmlPageUrl);
  await page.waitForSelector(LOADED_TAG);
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}

export default {
  pdf: async ({ url }, req) => {
    const pdfBuffer = await generatePdf(url, req.headers['accept-language']);
    const downloadUrl = await storage.uploadToTempDownloadServer('resume.pdf', pdfBuffer);
    return downloadUrl;
  },
};
