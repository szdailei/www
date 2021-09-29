import path from 'path';
import shell from 'shelljs';
import minimist from 'minimist';
import log from 'loglevel';
import { getConfig } from '../config';
import HELP from './HELP';
import bundleServers from './bundle-servers';
import copyWeb from './copy-web';
import copyCoursesAndLocalHtml from './copy-courses-local-html';
import copyScripts from './copy-scripts';
import copyDocs from './copy-docs';

function getTheScriptDir() {
  return new URL('.', import.meta.url).pathname;
}

function getRootAndDistDir() {
  const theScriptDir = getTheScriptDir();
  const root = path.join(theScriptDir, '..');
  const dist = path.join(root, 'dist/');
  return { root, dist };
}

function clean(dist) {
  shell.rm('-rf', dist);
  shell.mkdir(dist);
}

function bundle(root, dist, origCoursesDir) {
  bundleServers(root, dist);
  copyWeb(root, dist);
  copyCoursesAndLocalHtml(root, dist, origCoursesDir);
  copyScripts(root, dist);
  copyDocs(root, dist);
}

(async () => {
  const args = minimist(process.argv.slice(2), {
    boolean: ['help'],
    alias: {
      help: 'h',
    },
  });

  if (args.help || process.argv.length > 2) {
    log.warn(HELP);
    process.exit(0);
  }

  const theScriptDir = getTheScriptDir();
  const config = await getConfig(theScriptDir, 'bundle.toml');
  const origCoursesDir = config.courses.root;
  if (!origCoursesDir) throw new Error("can't found courses.root in config file");

  const { root, dist } = getRootAndDistDir();
  clean(dist);

  bundle(root, dist, origCoursesDir);
})();
