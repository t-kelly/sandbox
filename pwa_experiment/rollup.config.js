import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
  input: 'pwa/sw.js',
  output: {
    file: 'public/sw.js',
    format: 'iife'
  },
  plugins: [ 
    resolve(),
    replace({
      // alternatively, one could pass process.env.NODE_ENV or 'development` to stringify
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};