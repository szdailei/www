import path from 'path';
import shell from 'shelljs';
import packerServers from './packer-servers';
import prepareWeb from './prepare-web';
import copyTargetScripts from './copy-target-scripts';

function getPath() {
  const execScriptPath = new URL('.', import.meta.url).pathname;
  const root = path.join(execScriptPath, '..');
  const dist = path.join(root, 'dist/');
  return { root, dist };
}

function clean(dist) {
  shell.rm('-rf', dist);
  shell.mkdir(dist);
}

(async () => {
  const { root, dist } = getPath();
  clean(dist);

  packerServers(root, dist);
  prepareWeb(root, dist);
  copyTargetScripts(root, dist);
})();
