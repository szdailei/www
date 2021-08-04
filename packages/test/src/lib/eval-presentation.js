import config from '../config.js';

async function waitForDone(page) {
  const maxTimeout = 5000;
  await page.waitForSelector(config.LOADED_TAG, {
    timeout: maxTimeout,
  });
}

async function getFileNames(page) {
  const elements = await page.$$('a');
  const result = [];
  for (let i = 0; i < elements.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const name = await elements[i].evaluate((node) => node.innerText);
    result.push(name);
  }
  return result;
}

async function getLinkByFileName(page, name) {
  const elements = await page.$$('a');
  for (let i = 0; i < elements.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const result = await elements[i].evaluate((node) => node.innerText);
    if (name === result) return elements[i];
  }
  return null;
}

async function getDocumentHeight(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  return height;
}

async function getCurrentPageNum(page) {
  const footer = await page.$eval('footer', (element) => element.textContent);
  const footerStr = footer.toString();
  const rightStr = footerStr.slice(footerStr.length - 7);

  const tokens = rightStr.split('/');
  return Number.parseInt(tokens[0].trim(), 10);
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

async function getTotalPagesNum(page) {
  const footer = await page.$eval('footer', (element) => element.textContent);
  const tokens = footer.split('/');
  return Number.parseInt(tokens[1].trim(), 10);
}

async function isFooterHidden(page) {
  const result = await page.$eval('footer', (element) => {
    const style = window.getComputedStyle(element);
    if (style.visibility === 'hidden') {
      return true;
    }
    return false;
  });
  return result;
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

export {
  waitForDone,
  getFileNames,
  getLinkByFileName,
  getCurrentPageNum,
  getDocumentTitle,
  getTextContentById,
  getTotalPagesNum,
  getDocumentHeight,
  isFooterHidden,
  isFullscreen,
  isTitleExist,
};
