import minimist from 'minimist';
import log from '../lib/log';
import runLoadTest from './run-load-test';
import VERSION from './VERSION';
import HELP from './HELP';

const args = minimist(process.argv.slice(2), {
  boolean: ['version', 'help'],
  alias: {
    help: 'h',
    version: 'v',
    connections: 'c',
    duration: 'd',
  },
  default: {
    connections: 100,
    duration: 5,
  },
  unknown: () => {
    log.error(HELP);
    process.exit(1);
  },
});

if (args.help) {
  log.warn(HELP);
  process.exit(0);
}

if (args.version) {
  log.warn(VERSION);
  process.exit(0);
}

runLoadTest(args.duration, args.connections);
