/* eslint-disable no-console */
import minimist from 'minimist';
import VERSION from './VERSION.js';
import HELP from './HELP.js';
import runLoadTest from './run-load-test.js';

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
    console.error(HELP);
    process.exit(1);
  },
});
if (args.help) {
  console.log(HELP);
  process.exit(0);
}
if (args.version) {
  console.log(VERSION);
  process.exit(0);
}

runLoadTest(args.duration, args.connections);
