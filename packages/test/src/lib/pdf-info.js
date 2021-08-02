import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function getPdfInfo(pdfPath) {
  const buffer = await fs.promises.readFile(pdfPath);
  const typedPdfByteArray = Uint8Array.from(buffer);
  const pdfDoc = await PDFDocument.load(typedPdfByteArray);

  const pageCount = pdfDoc.getPageCount();
  const page = pdfDoc.getPage(0);
  const size = page.getSize();
  return { pageCount, size };
}

export default getPdfInfo;
