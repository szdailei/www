import fs from 'fs';
import path from 'path';
import TOML from '@iarna/toml';

function getExecScriptPath() {
  const isESModule = typeof __dirname === 'undefined';

  let execScriptPath;
  if (isESModule) {
    execScriptPath = new URL('.', import.meta.url).pathname;
  } else {
    // __dirname is always '/snapshot' in pkg environment, not real script path.
    execScriptPath = process.pkg ? process.execPath : __dirname;
  }

  return execScriptPath;
}

function getWorkingPath() {
  return process.cwd();
}

async function getConfig(configPath, configFileName) {
  const configFilePath = path.join(configPath, configFileName);
  const data = await fs.promises.readFile(configFilePath, 'utf8');
  return TOML.parse(data);
}

async function getConfigInExecScriptPath(configFileName) {
  const execScriptPath = getExecScriptPath();
  return getConfig(execScriptPath, configFileName);
}

async function getConfigInWorkingPath(configFileName) {
  const workingPath = getWorkingPath();
  return getConfig(workingPath, configFileName);
}

export { getConfigInExecScriptPath, getConfigInWorkingPath };
