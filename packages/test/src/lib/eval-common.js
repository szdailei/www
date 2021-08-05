import config from '../config.js';

async function waitForDone(page) {
  const maxTimeout = 5000;
  await page.waitForSelector(config.LOADED_TAG, {
    timeout: maxTimeout,
  });
}

async function getDocumentHeight(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  return height;
}

async function getDocumentTitle(page) {
  const documentTitle = await page.evaluate(() => document.title);
  return documentTitle;
}

async function getTextContentById(page, id) {
  try {
    return await page.$eval(id, (element) => element.textContent);
  } catch (_) {
    return null;
  }
}

async function isFullscreen(page) {
  const result = await page.evaluate(() => {
    if (document.fullscreenElement) return true;
    return false;
  });
  return result;
}

async function isTitleExist(page) {
  try {
    await page.$eval('#title', () => null);
    return true;
  } catch (_) {
    return false;
  }
}

export { waitForDone, getDocumentHeight, getDocumentTitle, getTextContentById, isFullscreen, isTitleExist };
