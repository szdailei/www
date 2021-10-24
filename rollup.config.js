import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import { string } from 'rollup-plugin-string';

const mode = process.env.NODE_ENV;

const config = {
  input: 'src/start.js',
  output: [
    {
      dir: 'dist',
      format: 'esm',
      entryFileNames: 'index.js',
      chunkFileNames: '[name]-[hash].js',
    },
  ],
  plugins: [
    resolve({ extensions: ['.mjs', '.js', '.jsx'], preferBuiltins: false }),
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-env', { targets: { chrome: 86 } }], '@babel/preset-react'],
      include: ['../**/src/**'],
      extensions: ['.jsx', '.tsx'],
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify(mode), preventAssignment: true }),
    external(),
    json(),
    postcss({
      plugins: [],
    }),
    string({
      include: '**/*.md',
    }),
    commonjs(),
  ],
};

export default config;
