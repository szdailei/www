import path from 'path';
import shell from 'shelljs';

async function copyWeb(root, dist) {
  const origWeb = path.join(root, 'packages/client/dist/web');
  shell.cp('-R', origWeb, dist);
}

export default copyWeb;
