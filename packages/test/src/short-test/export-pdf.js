import { getTotalPagesNum } from '../lib/eval-presentation.js';
import getPdfInfo from '../lib/pdf-info.js';
import { pdfByPresentation } from '../lib/pdf.js';

async function exportPdf(page, pdfFileName, defaultViewPort) {
  const totalPagesNum = await getTotalPagesNum(page);
  await pdfByPresentation(page, pdfFileName, defaultViewPort);

  const info = await getPdfInfo(pdfFileName);
  expect(info.pageCount).toBe(totalPagesNum);
}

export default exportPdf;
