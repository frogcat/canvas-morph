import resolve from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';

export default {
  input: 'canvas-morph.js',
  output: {
    file: 'docs/canvas-morph.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    buble()
  ]
};
