import path from 'path';
import shell from 'shelljs';
import packerServers from './packer-servers'
import prepareWeb from './prepare-web'
import copyTargetScripts from './copy-target-scripts'

(async () => {
  const execScriptPath = new URL('.', import.meta.url).pathname;
  const root = path.join(execScriptPath, '..');
  const dist = path.join(root, 'dist/');

  shell.rm('-rf', dist)
  shell.mkdir(dist);

  packerServers(root,dist)
  prepareWeb(root,dist)
  copyTargetScripts(root,dist)
})();