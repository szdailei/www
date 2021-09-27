/* eslint-disable no-await-in-loop */
import log from './log';

async function waitLoaded(page, timeout = 5000) {
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

    log.warn('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, ' body html size: ', bodyHTMLSize);

    if (lastHTMLSize !== 0 && currentHTMLSize === lastHTMLSize) countStableSizeIterations += 1;
    else countStableSizeIterations = 0;

    if (countStableSizeIterations >= minStableSizeIterations) {
      log.warn('Page rendered fully..');
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
    checkCounts += 1;
  }
}

export default waitLoaded;
