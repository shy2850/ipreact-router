const typescript = require('rollup-plugin-typescript2')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
module.exports = [{
    input: 'src/test.tsx',
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs()
    ],
    output: {
        sourcemap: true,
        intro: 'var process = {env: {}};',
        file: 'bundle.js',
        format: 'iife'
    }
}]
