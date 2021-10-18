/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable class-methods-use-this */
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = () => {
  const SOURCE_DIR = path.join(__dirname, './src/');
  const TARGET_DIR = path.join(__dirname, './dist/');

  const filename = 'index.js';
  const entry = path.join(SOURCE_DIR, 'index.ts');

  const plugins = [new ForkTsCheckerWebpackPlugin()];

  return {
    mode,
    devtool: 'source-map',
    entry,
    target: 'node',
    resolve: {
      extensions: ['.mjs', '.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          /* options: see below */
        }),
      ],
    },
    output: {
      libraryTarget: 'commonjs',
      path: TARGET_DIR,
      filename,
    },
    //   externals: [],
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.join(__dirname, mode === 'production' ? 'tsconfig.build.json' : 'tsconfig.json'),
              },
            },
          ],
        },
      ],
    },
    plugins,
    externals: ['aws-sdk'],
    optimization: {
      minimize: false,
      //   Turned this off because it apollo server throws error, schema must contain uniquely named types but contains multiple types named "XXX"
    },
  };
};
