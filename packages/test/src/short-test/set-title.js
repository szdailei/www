import { getDocumentTitle, getTextContentById } from '../lib/eval-presentation.js';

async function setTitle(page) {
  const title = await getTextContentById(page, '#title');
  if (title) expect(await getDocumentTitle(page)).toBe(title);
}

export default setTitle;
