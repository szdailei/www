/**
按照以下方法修改node_modules/puppeteer-core/目录里面的文件，以便puppeteer-core可以被rollup打包：
1. lib/esm/puppeteer/common/Debug.js第56行：
    return require('debug')(prefix);
    修改为：
    return ()=>{};
2. lib/esm/puppeteer/initialize-node.js第20行：
     const puppeteerRootDirectory = pkgDir.sync(__dirname)
     修改为：
    import path from 'path'
    const dirname = path.dirname(new URL(import.meta.url).pathname)
    const puppeteerRootDirectory = pkgDir.sync(dirname)
20210925新增：为了避免将es6转化为es5，取消使用import.meta.url
     修改为：
    const puppeteerRootDirectory = null
3. package.json新增一行：
  "type": "module",
*/

import fs from 'fs';
import path from 'path';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const puppeteerRootDir = path.join(dirname, 'node_modules/puppeteer-core/');
const puppeteerDir = path.join(puppeteerRootDir, 'lib/esm/puppeteer/');

const puppeteerDebugFile = path.join(puppeteerDir, 'common/Debug.js');
let lines = fs.readFileSync(puppeteerDebugFile, 'utf8').split('\n');
let newCode = '';
lines.forEach((line) => {
  if (line.trim() !== `return require('debug')(prefix);`) {
    newCode += `${line}\n`;
  } else {
    newCode += `//${line}\nreturn ()=>{}\n`;
  }
});
fs.writeFileSync(puppeteerDebugFile, newCode);

const initializeFile = path.join(puppeteerDir, 'initialize-node.js');
lines = fs.readFileSync(initializeFile, 'utf8').split('\n');
/*
if (lines[0].trim() === `import path from 'path'`) {
  newCode = ``;
} else {
  newCode = `import path from 'path'\n`;
} */
newCode = ``

lines.forEach((line) => {
  if (line.trim() !== `const puppeteerRootDirectory = pkgDir.sync(__dirname);`) {
    newCode += `${line}\n`;
  } else {
//    newCode += `//${line}\nconst dirname = path.dirname(new URL(import.meta.url).pathname)\n    const puppeteerRootDirectory = pkgDir.sync(dirname)\n`;
      newCode += `//${line}\n    const puppeteerRootDirectory = null\n`
  }
});
fs.writeFileSync(initializeFile, newCode);

const packageJsonFile = path.join(puppeteerRootDir, 'package.json');
lines = fs.readFileSync(packageJsonFile, 'utf8').split('\n');
newCode = '';
let modified = false;
lines.forEach((line) => {
  if (line.trim() === `"type": "module",`) {
    modified = true;
  }
  if (modified) {
    newCode += `${line}\n`;
  } else if (line.trim() !== `"name": "puppeteer-core",`) {
    newCode += `${line}\n`;
  } else {
    newCode += `  "type": "module",\n${line}\n`;
  }
});
fs.writeFileSync(packageJsonFile, newCode);
