/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { waitForDone, getLinkByFileName, getTotalPagesNum, getDocumentHeight } from './eval-presentation.js';
import setFontSizes from './set-font-sizes.js';

async function pdfByPresentation(page, pdfFileName, defaultViewPort) {
  const viewPort = { ...defaultViewPort };
  await page.keyboard.up('Home');
  await page.mouse.move(0, 0);
  const totalPagesNum = await getTotalPagesNum(page);

  const pdfBuffers = [];
  for (let i = 0; i < totalPagesNum; i += 1) {
    const height = await getDocumentHeight(page);
    viewPort.height = height;

    const buffer = await page.pdf(viewPort);
    pdfBuffers.push(buffer);
    if (i !== totalPagesNum - 1) {
      await page.keyboard.up('PageDown');
      await waitForDone(page);
    }
  }

  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < totalPagesNum; i += 1) {
    const pdfBytes = await PDFDocument.load(pdfBuffers[i]);
    const copiedPages = await pdfDoc.copyPages(pdfBytes, [0]);
    pdfDoc.addPage(copiedPages[0]);
  }

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(pdfFileName, pdfBytes);
}

async function pdfByCoursesPage(page, origFileName, config) {
  const link = await getLinkByFileName(page, origFileName);
  await link.click();
  await waitForDone(page);

  await setFontSizes(page, config.FONT_SIZE);
  const fileNameWithoutSuffix = origFileName.substring(0, origFileName.lastIndexOf('.'));
  const pdfFileName = `${config.PDFS_DIR}${fileNameWithoutSuffix}.pdf`;

  await pdfByPresentation(page, pdfFileName, config.VIEWPORT);
}

export { pdfByPresentation, pdfByCoursesPage };
