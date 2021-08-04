import { waitForDone, getFileNames, getLinkByFileName } from './eval-presentation.js';

async function gotoCourses(browser, config) {
  const page = await browser.newPage();
  await page.setViewport(config.VIEWPORT);
  await page.goto(process.env.COURSES_PAGE);
  await waitForDone(page);
  return page;
}

async function gotoFirstPresentation(browser, config) {
  const page = await gotoCourses(browser, config);
  const fileNames = await getFileNames(page);
  const [firstFileName] = fileNames;
  const link = await getLinkByFileName(page, firstFileName);
  await link.click();
  await waitForDone(page);
  return { page, fileNames, firstFileName };
}

export { gotoCourses, gotoFirstPresentation };
