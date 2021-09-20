/* eslint-disable no-await-in-loop */
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { waitForDone, getDocumentViewPort } from './eval-common.js';
import { getTotalPagesNum } from './eval-presentation.js';

async function setFontSizes(page, standardSize) {
  const client = await page.target().createCDPSession();
  await client.send('Page.enable');
  await client.send('Page.setFontSizes', {
    fontSizes: {
      standard: standardSize,
    },
  });
}

async function exportPdfBuffersToFile(pdfFileName, pdfBuffers, totalPagesNum) {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < totalPagesNum; i += 1) {
    const pdfBytes = await PDFDocument.load(pdfBuffers[i]);
    const [firstPage] = await pdfDoc.copyPages(pdfBytes, [0]);
    pdfDoc.addPage(firstPage);
  }

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(pdfFileName, pdfBytes);
}

async function createPdfBuffers(page, totalPagesNum, defaultViewPort, fontSize) {
  const viewPort = { ...defaultViewPort };
  await setFontSizes(page, fontSize);
  await page.keyboard.up('Home');
  await page.mouse.move(0, 0);

  const pdfBuffers = [];
  for (let i = 0; i < totalPagesNum; i += 1) {
    const { width, height } = await getDocumentViewPort(page);
    viewPort.width = width;
    viewPort.height = height;

    const buffer = await page.pdf(viewPort);
    pdfBuffers.push(buffer);
    if (i !== totalPagesNum - 1) {
      await page.keyboard.up('PageDown');
      await waitForDone(page);
    }
  }

  return pdfBuffers;
}

async function exportPdf(page, config, origFileName, origTotalPagesNum) {
  const totalPagesNum = origTotalPagesNum || (await getTotalPagesNum(page));
  const fileNameWithoutSuffix = origFileName.substring(0, origFileName.lastIndexOf('.'));
  let pdfFileName;
  if (fileNameWithoutSuffix) {
    pdfFileName = `${config.PDFS_DIR}${fileNameWithoutSuffix}.pdf`;
  } else {
    pdfFileName = `${config.PDFS_DIR}${origFileName}.pdf`;
  }

  const pdfBuffers = await createPdfBuffers(page, totalPagesNum, config.VIEWPORT, config.FONT_SIZE);
  await exportPdfBuffersToFile(pdfFileName, pdfBuffers, totalPagesNum);
}

export { createPdfBuffers, exportPdf };
