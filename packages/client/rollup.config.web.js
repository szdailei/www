import baseConfig from '../../rollup.config.js';

const config = { ...baseConfig };

config.input = 'src/www-app.jsx';
config.output[0].dir = 'dist/web';
config.output[0].entryFileNames = 'app.js';

export default config;
