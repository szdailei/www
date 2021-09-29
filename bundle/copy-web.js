import path from 'path';
import shell from 'shelljs';

async function copyWeb(root, dist) {
  const origWebDir = path.join(root, 'packages/client/dist/web');
  shell.cp('-R', origWebDir, dist);
}

export default copyWeb;
