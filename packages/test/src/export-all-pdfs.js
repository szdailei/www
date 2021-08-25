/* eslint-disable no-await-in-loop */
import fs from 'fs';
import dotenv from 'dotenv-defaults';
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/node.js';
import config from './config.js';
import { waitForDone, getTextContentById } from './lib/eval-common.js';
import { newCoursesPage, gotoCourse, getFileNames, getLinkByFileName } from './lib/eval-courses.js';
import { exportPdf } from './lib/pdf.js';

function getMdxWithoutClockAndTimer(text) {
  const uselessTags = ['<Clock />', '<Clock>', '<Timer />', '<Timer>', '<ClockOrTimer />', '<ClockOrTimer>'];

  const regex = new RegExp(uselessTags.join('|'), 'g');

  const lines = text.split('\n');
  let result = '';
  for (let i = 0; i < lines.length; i += 1) {
    lines[i] = lines[i].replace(regex, '');
    result += `${lines[i]}\n`;
  }
  return result;
}

async function createIntroMdx(fileNames) {
  const titlesArray = [];
  let titles = '';
  for (let i = 0; i < fileNames.length; i += 1) {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });
    const page = await newCoursesPage(browser, config);
    const link = await getLinkByFileName(page, fileNames[i]);
    await link.click();
    await waitForDone(page);
    const title = await getTextContentById(page, '#title');
    titles += `1. ${title}\n`;
    titlesArray.push(title);
    await browser.close();
  }

  let intro = `
<Title>课程介绍</Title>

<Div display=flex justifyContent=center fontSize=1.2em>
作者：代磊
</Div>

---
<Header>课程清单</Header>

${titles}

<br>

<hr>

<br>

- 每门课各摘录5页，分别是：
  1. 课程介绍
  1. 目录
  1. 总结
  1. 错误行为检查表
  1. 回顾

`;

  for (let i = 0; i < fileNames.length; i += 1) {
    const footer = `\n\n<Footer>${titlesArray[i]}</Footer>\n\n`;
    const data = await fs.promises.readFile(`${config.COURSES_DIR}${fileNames[i]}`, 'utf8');
    const pages = data.split('---');
    intro += `---${pages[1]}${footer}---${pages[2]}${footer}---${pages[pages.length - 3]}${footer}---${
      pages[pages.length - 2]
    }${footer}---${pages[pages.length - 1]}${footer}`;
  }
  await fs.promises.writeFile(`${config.COURSES_DIR}${config.INTRO_FILE}`, intro);
}

async function copyToTempFile(origFileNames, tempFileNames) {
  for (let i = 0; i < origFileNames.length; i += 1) {
    let data = await fs.promises.readFile(`${config.COURSES_DIR}${origFileNames[i]}`, 'utf8');
    data = getMdxWithoutClockAndTimer(data);
    await fs.promises.writeFile(`${config.COURSES_DIR}${tempFileNames[i]}`, data);
  }
}

async function getOrigFileNames() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: { ...config.VIEWPORT },
  });

  const page = await newCoursesPage(browser, config);
  const origFileNames = await getFileNames(page);
  await browser.close();
  return origFileNames;
}

(async () => {
  await dotenv.config();

  const origFileNames = await getOrigFileNames();

  const tempFileNames = [];
  for (let i = 0; i < origFileNames.length; i += 1) {
    tempFileNames.push(`${config.TEMP_PREFIX}${origFileNames[i]}`);
  }
  copyToTempFile(origFileNames, tempFileNames);

  await createIntroMdx(tempFileNames);
  tempFileNames.push(config.INTRO_FILE);

  tempFileNames.forEach(async (fileName) => {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    const page = await newCoursesPage(browser, config);
    await gotoCourse(page, fileName);
    await exportPdf(page, fileName, config);
    await browser.close();

    await fs.promises.unlink(`${config.COURSES_DIR}${fileName}`);

    if (fileName === config.INTRO_FILE) return;
    const fileNameWithoutSuffix = fileName.substring(0, fileName.lastIndexOf('.'));
    const fileNameWithoutTempPrefix = fileNameWithoutSuffix.slice(config.TEMP_PREFIX.length);
    await fs.promises.rename(
      `${config.PDFS_DIR}${fileNameWithoutSuffix}.pdf`,
      `${config.PDFS_DIR}${fileNameWithoutTempPrefix}.pdf`
    );
  });
})();
