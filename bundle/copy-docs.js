import path from 'path';
import shell from 'shelljs';

function copyDocs(root, dist) {
  const readmeFile = path.join(root, 'README.md');
  shell.cp(readmeFile, dist);
}

export default copyDocs;
