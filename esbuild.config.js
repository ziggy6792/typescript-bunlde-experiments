/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outdir: 'dist',
    // outfile: './dist/index.js',
    bundle: true,
    platform: 'node',
    sourcemap: true,
    target: 'node14',
    plugins: [esbuildDecorators()],
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
