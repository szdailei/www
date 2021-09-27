import path from 'path';
import shell from 'shelljs';
import minimist from 'minimist';
import log from 'loglevel';
import { getConfig } from '../config';
import HELP from './HELP';
import packServers from './pack-servers';
import copyWeb from './copy-web';
import copyCoursesAndLocalHtml from './copy-courses-local-html';
import copyTargetScripts from './copy-target-scripts';

function getExecScriptPath() {
  return new URL('.', import.meta.url).pathname;
}

function getPath() {
  const execScriptPath = getExecScriptPath();
  const root = path.join(execScriptPath, '..');
  const dist = path.join(root, 'dist/');
  return { root, dist };
}

function clean(dist) {
  shell.rm('-rf', dist);
  shell.mkdir(dist);
}

(async () => {
  const args = minimist(process.argv.slice(2), {
    boolean: ['help'],
    alias: {
      help: 'h',
    },
  });

  if (args.help) {
    log.warn(HELP);
    process.exit(0);
  }

  const config = await getConfig(getExecScriptPath(), 'packer.toml');
  const origCoursesDir = config['courses-dir'];
  if (!origCoursesDir) throw new Error("can't found courses-dir in config file");

  const { root, dist } = getPath();
  clean(dist);

  packServers(root, dist);
  copyWeb(root, dist);
  copyCoursesAndLocalHtml(root, dist, origCoursesDir);
  copyTargetScripts(root, dist);
})();
