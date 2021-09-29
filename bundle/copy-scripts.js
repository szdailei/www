import path from 'path';
import shell from 'shelljs';

function copyScripts(root, dist) {
  const origScriptsDir = path.join(root, 'target-scripts', '*');
  const scriptsDir = path.join(dist, 'scripts');
  shell.mkdir(scriptsDir);
  shell.cp(origScriptsDir, scriptsDir);
}

export default copyScripts;
