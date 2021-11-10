/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
require('dotenv').config();

import buildLocalServer from './local-server';

process.on('uncaughtException', (error) => {
  // console.log('error', error);
  // make sure the process exits if we hit a compilation error, so ts-node-dev can restart on next change
  if (error.message.includes('Unable to compile TypeScript')) process.exit(0);
});

buildLocalServer();
