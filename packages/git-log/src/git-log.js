import fs from 'fs';
import path from 'path';
import { gitlogPromise } from 'gitlog';

(async () => {
  const execScriptPath = new URL('.', import.meta.url).pathname;
  const repo = path.join(execScriptPath, '../../..');

  const locale = 'cn';
  const GIT_LOG_JSON = 'reports/git-log.json';
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;

  const options = {
    repo,
    since: new Date(Date.now() - month * 1),
    number: 100,
    fields: ['subject', 'body', 'committerName', 'committerEmail', 'committerDate', 'authorName'],
  };
  const result = {
    repo,
    locale,
    data: await gitlogPromise(options),
  };

  await fs.promises.writeFile(GIT_LOG_JSON, JSON.stringify(result), 'utf-8');
})();
