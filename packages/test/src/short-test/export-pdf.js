import { getTotalPagesNum } from '../lib/eval-presentation.js';
import getPdfInfo from '../lib/pdf-info.js';
import { pdfByPresentation } from '../lib/pdf.js';

function getTestedFileName(pdfPath) {
  const tokens = pdfPath.split('/');
  return tokens[tokens.length - 1].trim();
}

// If there is code in presentation, one presentation page whill be created one more pdf pages.
function getIncreasedPdfPages() {
  return 2;
}

function getExpectPdfPages(fileName, totalPages) {
  return totalPages + getIncreasedPdfPages(fileName);
}

async function exportPdf(page, options, config) {
  await pdfByPresentation(page, options, config);

  const totalPagesNum = await getTotalPagesNum(page);
  const info = await getPdfInfo(options.path);
  const testedFileName = getTestedFileName(options.path);
  expect(info.pageCount).toBe(getExpectPdfPages(testedFileName, totalPagesNum));
  expect(info.size.width).toBe(options.expectedPdfWidth);
  expect(info.size.height).toBe(options.expectedPdfHeight);
  await page.keyboard.up('KeyA'); // switch back.
}

export default exportPdf;
