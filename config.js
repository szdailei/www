import fs from 'fs';
import path from 'path';
import TOML from '@iarna/toml';

/*
@require  none
@ensure
1. return dir of this script if ESModule format. 
    Note, you should copy the code into the first running script if you didn't use pack tool.
    Because theScriptDir is same dir as the first running script only for packed all scripts into one.
2. return dir of the first running script if CJSModule format.
3. return dir of the running exe if exe format packed by pkg.
*/
function getTheScriptDir() {
  const isESModule = typeof __dirname === 'undefined';

  let theScriptDir;
  if (isESModule) {
    theScriptDir = new URL('.', import.meta.url).pathname;
  } else {
    // __dirname is always '/snapshot' in pkg environment, not real script path.
    theScriptDir = process.pkg ? path.dirname(process.execPath) : __dirname;
  }
  return theScriptDir;
}

function getWorkDir() {
  return process.cwd();
}

async function getConfig(configPath, configFileName) {
  const configFilePath = path.join(configPath, configFileName);
  const data = await fs.promises.readFile(configFilePath, 'utf8');
  return TOML.parse(data);
}

async function getConfigInConfigScriptDir(configFileName) {
  const configScriptDir = getTheScriptDir();
  return getConfig(configScriptDir, configFileName);
}

async function getConfigInWorkDir(configFileName) {
  const workingPath = getWorkDir();
  return getConfig(workingPath, configFileName);
}

export { getConfig, getConfigInConfigScriptDir, getConfigInWorkDir };
