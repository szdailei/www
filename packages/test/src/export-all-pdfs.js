/* eslint-disable no-await-in-loop */
import fs from 'fs';
import dotenv from 'dotenv-defaults';
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/node.js';
import config from './config.js';
import { waitForDone, getFileNames, getLinkByFileName, getTextContentById } from './lib/eval-presentation.js';
import { gotoCourses } from './lib/goto-page.js';
import { pdfByCoursesPage } from './lib/pdf.js';

async function exportPdf(fileName) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });

  const page = await gotoCourses(browser, config);
  await pdfByCoursesPage(page, fileName, config);
  await browser.close();
}

function getMdxWithoutClock(data) {
  const lines = data.split('\n');
  let result = '';
  for (let i = 0; i < lines.length; i += 1) {
    lines[i] = lines[i].replace('<Clock></Clock>', '');
    lines[i] = lines[i].replace('<Clock />', '');
    lines[i] = lines[i].replace('<Timer></Timer>', '');
    lines[i] = lines[i].replace('<Timer />', '');
    lines[i] = lines[i].replace('<ClockOrTimer></ClockOrTimer>', '');
    lines[i] = lines[i].replace('<ClockOrTimer />', '');
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
    const page = await gotoCourses(browser, config);
    const link = await getLinkByFileName(page, fileNames[i]);
    await link.click();
    await waitForDone(page);
    const title = await getTextContentById(page, '#title');
    titles += `- ${title}\n`;
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


`;

  for (let i = 0; i < fileNames.length; i += 1) {
    const footer = `\n\n<Footer>${titlesArray[i]}</Footer>\n\n`;
    const data = await fs.promises.readFile(`${config.COURSES_DIR}${fileNames[i]}`, 'utf8');
    const pages = data.split('---');
    intro += `---${pages[1]}${footer}---${pages[2]}${footer}---${pages[pages.length - 2]}${footer}---${
      pages[pages.length - 1]
    }${footer}`;
  }
  await fs.promises.writeFile(`${config.COURSES_DIR}${config.INTRO_FILE}`, intro);
}

async function copyToTempFile(origFileNames, tempFileNames) {
  for (let i = 0; i < origFileNames.length; i += 1) {
    let data = await fs.promises.readFile(`${config.COURSES_DIR}${origFileNames[i]}`, 'utf8');
    data = getMdxWithoutClock(data);
    await fs.promises.writeFile(`${config.COURSES_DIR}${tempFileNames[i]}`, data);
  }
}

(async () => {
  await dotenv.config();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: { ...config.VIEWPORT },
  });

  const page = await gotoCourses(browser, config);
  const origFileNames = await getFileNames(page);
  await browser.close();

  const tempFileNames = [];
  for (let i = 0; i < origFileNames.length; i += 1) {
    tempFileNames.push(`${config.TEMP_PREFIX}${origFileNames[i]}`);
  }
  copyToTempFile(origFileNames, tempFileNames);

  await createIntroMdx(tempFileNames);
  tempFileNames.push(config.INTRO_FILE);

  tempFileNames.forEach(async (fileName) => {
    await exportPdf(fileName);
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
