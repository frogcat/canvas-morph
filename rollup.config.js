import resolve from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';
import {
  terser
} from 'rollup-plugin-terser';

export default {
  input: 'canvas-morph.js',
  output: [{
    file: 'docs/canvas-morph.js',
    format: 'iife'
  }, {
    file: 'docs/canvas-morph.min.js',
    format: 'iife',
    plugins: [terser()]
  }],
  plugins: [
    resolve(),
    buble()
  ]
};
