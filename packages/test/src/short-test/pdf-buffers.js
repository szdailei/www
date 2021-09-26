import { getTotalPagesNum } from '../lib/eval-presentation.js';
import { createPdfBuffers } from '../lib/pdf.js';

async function testPdfBuffers(page) {
  const totalPagesNum = await getTotalPagesNum(page);
  const pdfBuffers = await createPdfBuffers(page, totalPagesNum);
  expect(pdfBuffers.length).toBe(totalPagesNum);
}

export default testPdfBuffers;
