import puppeteer from 'puppeteer-core';
import dotenv from 'dotenv-defaults';
import { newCoursesPage, gotoFirstCourse } from '../lib/eval-courses';
import switchFullScreen from './switch-full-screen';
import config from '../config';

let browser;
let page;

const ptFullScreenReq = `全屏演示。`;
describe(ptFullScreenReq, () => {
  const switchFullScreenStepContr = `按动F键，在全屏和非全屏之间切换。`;
  test(switchFullScreenStepContr, async () => {
    await switchFullScreen(page);
  });
});

beforeAll(async () => {
  await dotenv.config();
  browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: config.DEFAULT_VIEWPORT,
  });

  page = await newCoursesPage(browser);
  await gotoFirstCourse(page);
});

afterAll(async () => {
  await browser.close();
});
