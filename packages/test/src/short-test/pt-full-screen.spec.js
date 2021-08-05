import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv-defaults';
import { newCoursesPage, gotoFirstCourse } from '../lib/eval-courses.js';
import testSwitchFullScreen from './switch-full-screen.js';
import config from '../config.js';

let browser;
let page;

const ptFullScreenReq = `全屏演示。`;
describe(ptFullScreenReq, () => {
  const switchFullScreenStepContr = `按动F键，在全屏和非全屏之间切换。`;
  test(switchFullScreenStepContr, async () => {
    await testSwitchFullScreen(page);
  });
});

beforeAll(async () => {
  await dotenv.config();
  browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });

  page = await newCoursesPage(browser, config);
  await gotoFirstCourse(page);
});

afterAll(async () => {
  await browser.close();
});
