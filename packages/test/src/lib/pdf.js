import { getLinkByFileName } from './eval-presentation.js';
import setFontSizes from './set-font-sizes.js';

async function pdfByPresentation(page, options, config) {
  await page.keyboard.up('KeyA'); // switch to all pages mode.
  await page.waitForSelector(config.LOADED_TAG);
  await page.pdf(options);
}

async function pdfByCoursesPage(page, origFileName, config) {
  const link = await getLinkByFileName(page, origFileName);
  await link.click();
  await page.waitForSelector(config.LOADED_TAG);

  await setFontSizes(page, config.FONT_SIZE);
  const fileNameWithoutSuffix = origFileName.substring(0, origFileName.lastIndexOf('.'));
  const options = {
    path: `${config.PDFS_DIR}${fileNameWithoutSuffix}.pdf`,
    ...config.VIEWPORT,
  };
  await pdfByPresentation(page, options, config);
}

export { pdfByPresentation, pdfByCoursesPage };
