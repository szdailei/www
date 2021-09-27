import path from 'path';
import shell from 'shelljs';

(async () => {
  const execScriptPath = new URL('.', import.meta.url).pathname;
  const root = path.join(execScriptPath, '..');
  const dist = path.join(root, 'dist/');

  const distOfWeb = path.join(dist, 'web');
  const origWeb = path.join(root, 'packages/client/dist/web');

  const distOfCourses = path.join(dist, 'courses');
  const origLocalFile = path.join(root, 'packages/client/dist/local/local-presentation.html');
  const origCourses = path.join(root, '../www-data/storage/courses');

  shell.mkdir(distOfWeb, distOfCourses);
  
  shell.cp('-R', origWeb, distOfWeb);

  shell.cp('-R', origCourses, distOfCourses);
  // ${origLocalFile} must be copied into parent folder of ${distOfCourses}
  shell.cp(origLocalFile, dist);
})();
