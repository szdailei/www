import baseConfig from '../../rollup.config';

const config = {...baseConfig}

config.input = 'src/__debug__/debug.js'
config.output[0].dir = 'dist/'
config.output[0].entryFileNames = 'debug.js';

export default config
