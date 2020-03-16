const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const babel = require('rollup-plugin-babel');
const terser = require("rollup-plugin-terser");
const version = process.env.VERSION || require('../package.json').version;

const banner =
  '/*!\n' +
  ` * YDLibrary.js v${version}\n` +
  ` * (c) 2019-${new Date().getFullYear()} Zhang Kaixuan\n` +
  ' * Released under the MIT License.\n' +
  ' */';

const defaultPlugins = [
  resolve(),
  commonjs(),
  json(),
  babel({
    exclude: 'node_modules/**'
  })
];

const buildMap = [
  'yd_library.cjs.js',
  'yd_library.cjs.min.js',
  'yd_library.iife.js',
  'yd_library.iife.min.js'
];

exports.builds = buildMap.map(item => {
  const _isMin = /(min)\.js$/.test(item);
  const _format = item.split('.')[1];
  return {
    input: 'src/entry.js',
    output: {
      file: 'dist/' + item,
      format: _format,
      banner
    },
    plugins: _isMin ? defaultPlugins.concat([terser.terser()]) : defaultPlugins
  }
});
