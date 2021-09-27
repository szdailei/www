import path from 'path';
import shell from 'shelljs';

function copyTargetScripts(root,dist) {
  const targetScriptsPath = path.join(root, 'target-scripts', '*');
  shell.cp(targetScriptsPath, dist);
}

export default copyTargetScripts;
