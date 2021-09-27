/* eslint-disable no-await-in-loop */
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import init from './init';
import config from './config';
import { createPageByUrl, waitForDone, getTextContentById } from './lib/eval-common';
import { gotoCourse, getFileNames, getLinkByFileName } from './lib/eval-courses';
import { exportPdf } from './lib/pdf';

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
      executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
    });

    const page = await createPageByUrl(browser, config.env.COURSES_PAGE);
    const link = await getLinkByFileName(page, fileNames[i]);
    await link.click();
    await waitForDone(page);
    const title = await getTextContentById(page, '#title');
    titles += `   1. ${title}\n`;
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

- ${fileNames.length}门课程。分别是：
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
    const data = await fs.promises.readFile(`${config.env.COURSES_DIR}${fileNames[i]}`, 'utf8');
    const pages = data.split('---');
    intro += `---${pages[1]}${footer}---${pages[2]}${footer}---${pages[pages.length - 3]}${footer}---${
      pages[pages.length - 2]
    }${footer}---${pages[pages.length - 1]}${footer}`;
  }
  await fs.promises.writeFile(`${config.env.COURSES_DIR}${config.INTRO_FILE}`, intro);
}

async function copyToTempFile(origFileNames, tempFileNames) {
  for (let i = 0; i < origFileNames.length; i += 1) {
    let data = await fs.promises.readFile(`${config.env.COURSES_DIR}${origFileNames[i]}`, 'utf8');
    data = getMdxWithoutClockAndTimer(data);
    await fs.promises.writeFile(`${config.env.COURSES_DIR}${tempFileNames[i]}`, data);
  }
}

async function getOrigFileNames() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: config.DEFAULT_VIEWPORT,
  });

  const page = await createPageByUrl(browser, config.env.COURSES_PAGE);
  const origFileNames = await getFileNames(page);
  await browser.close();
  return origFileNames;
}

(async () => {
  await init();

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
      executablePath: config.env.PUPPETEER_EXECUTABLE_PATH,
      defaultViewport: config.DEFAULT_VIEWPORT,
    });

    const page = await createPageByUrl(browser, config.env.COURSES_PAGE);
    await gotoCourse(page, fileName);
    await exportPdf(page, fileName);
    await browser.close();

    await fs.promises.unlink(`${config.env.COURSES_DIR}${fileName}`);

    if (fileName === config.INTRO_FILE) return;
    const fileNameWithoutSuffix = fileName.substring(0, fileName.lastIndexOf('.'));
    const fileNameWithoutTempPrefix = fileNameWithoutSuffix.slice(config.TEMP_PREFIX.length);
    await fs.promises.rename(
      `${config.PDFS_DIR}${fileNameWithoutSuffix}.pdf`,
      `${config.PDFS_DIR}${fileNameWithoutTempPrefix}.pdf`
    );
  });
})();
