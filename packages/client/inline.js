import { argv } from 'process';
import { dirname } from 'path';
import fs from 'fs';
import inlineHtml from 'web-resource-inliner/src/html.js';

(async () => {
  const input = argv[2];
  const output = argv[3];
  const relativeTo = dirname(input);

  function insertScriptType(origHtml) {
    const tag = '<script';
    const start = origHtml.indexOf(tag) + tag.length;
    const typeString = ' type=module';
    const html = origHtml.slice(0, start) + typeString + origHtml.slice(start);
    return html;
  }

  async function getHtml(fileName) {
    const origHtml = await fs.promises.readFile(fileName, 'utf8');
    const html = insertScriptType(origHtml);
    return html;
  }

  async function onResult(_, result) {
    await fs.promises.writeFile(output, result);
  }

  const options = {
    fileContent: await getHtml(input),
    relativeTo
  };

  inlineHtml(options, onResult);
})();
