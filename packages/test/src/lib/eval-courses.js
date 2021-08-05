/* eslint-disable no-await-in-loop */
import { waitForDone } from './eval-common.js';

async function newCoursesPage(browser, config) {
  const page = await browser.newPage();
  await page.setViewport(config.VIEWPORT);
  await page.goto(process.env.COURSES_PAGE);
  await waitForDone(page);
  return page;
}

async function getFileNames(page) {
  const elements = await page.$$('a');
  const result = [];
  for (let i = 0; i < elements.length; i += 1) {
    const name = await elements[i].evaluate((node) => node.innerText);
    result.push(name);
  }
  return result;
}

async function getLinkByFileName(page, name) {
  const elements = await page.$$('a');
  for (let i = 0; i < elements.length; i += 1) {
    const result = await elements[i].evaluate((node) => node.innerText);
    if (name === result) return elements[i];
  }
  return null;
}

async function gotoCourse(page, fileName) {
  const link = await getLinkByFileName(page, fileName);
  await link.click();
  await waitForDone(page);
}

async function gotoFirstCourse(page) {
  const [firstCourseName] = await getFileNames(page);
  const link = await getLinkByFileName(page, firstCourseName);
  await link.click();
  await waitForDone(page);
}

export { newCoursesPage, getFileNames, gotoCourse, gotoFirstCourse, getLinkByFileName };
