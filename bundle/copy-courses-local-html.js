import path from 'path';
import shell from 'shelljs';

async function copyCoursesAndLocalHtml(root, dist, origCoursesDir) {
  shell.cp('-R', origCoursesDir, dist);

  const origLocalFile = path.join(root, 'packages/client/dist/local/local-slide.html');
  // ${origLocalFile} must be copied into parent folder of courses
  shell.cp(origLocalFile, dist);
}

export default copyCoursesAndLocalHtml;
