import fs from 'fs';
import dotenv from 'dotenv-defaults';
import { gitlogPromise } from 'gitlog';

(async () => {
  await dotenv.config();

  const DEFAULT_LOCALE = 'cn';
  const GIT_LOG_JSON = 'reports/git-log.json';
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;

  const options = {
    repo: process.env.REPO,
    since: new Date(Date.now() - month * 1),
    number: 100,
    fields: ['subject', 'body', 'committerName', 'committerEmail', 'committerDate', 'authorName'],
  };
  const result = {
    repo: options.repo,
    locale: process.env.LOCALE || DEFAULT_LOCALE,
    data: await gitlogPromise(options),
  };

  await fs.promises.writeFile(GIT_LOG_JSON, JSON.stringify(result), 'utf-8');
})();
