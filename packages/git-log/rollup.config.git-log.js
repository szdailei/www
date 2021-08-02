import baseConfig from '../../rollup.config';

const config = {...baseConfig}

config.input = 'src/app.jsx'
config.output[0].dir = 'reports'
config.output[0].entryFileNames = 'app.js';

export default config
