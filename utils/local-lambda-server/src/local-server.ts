/* eslint-disable no-restricted-imports */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { createApolloServer, addGqlMiddleware } from '@whire-be/lambda-gq-resolver';

import express from 'express';

import config from 'src/config';

import buildCognitoAutorizer from './mock-gateway/cognito-authorizer';

import buildIamAutorizer from './mock-gateway/iam-authozier';

// import { cognitoAutorizer } from './mock-gateway/cognito-authorizer';
// eslint-disable-next-line import/order
import lambdaLocal = require('lambda-local');

const buildLocalServer = async () => {
  const app = express();

  const apolloServer = await createApolloServer();

  addGqlMiddleware(app);

  await apolloServer.start();

  const routes = [
    {
      path: '/lambda-gq-resolver/auth-user/graphql',
      middlewares: [await buildCognitoAutorizer(config.USER_POOL_ID)],
    },
    {
      path: '/lambda-gq-resolver/auth-role/graphql',
      middlewares: [await buildIamAutorizer()],
    },
    {
      path: '/lambda-gq-resolver/auth-none/graphql',
      middlewares: [],
    },
  ];

  routes.forEach(({ path, middlewares }) => {
    if (middlewares.length > 0) {
      app.use(path, ...middlewares);
    }
    apolloServer.applyMiddleware({ app, path });
  });

  // app.use('/lambda-user-confirmed', async (req, res) => {
  //   const result = await lambdaLocal.execute({
  //     lambdaPath: require.resolve('@whire-be/lambda-user-confirmed'),
  //     lambdaHandler: 'handler',
  //     envfile: path.join(__dirname, '.env-local'),
  //     event: {
  //       headers: req.headers, // Pass on request headers
  //       body: req.body, // Pass on request body
  //     },
  //   });

  //   res
  //     .status((result as any).statusCode)
  //     .set((result as any).headers)
  //     .end((result as any).body);
  // });

  // app.use('/lambda-a', async (req, res) => {
  //   const result = await lambdaLocal.execute({
  //     lambdaPath: require.resolve('@whire-be/lambda-a'),
  //     lambdaHandler: 'handler',
  //     envfile: path.join(__dirname, '.env-lambda'),
  //     event: {
  //       headers: req.headers, // Pass on request headers
  //       body: req.body, // Pass on request body
  //     },
  //   });

  //   res
  //     .status((result as any).statusCode)
  //     .set((result as any).headers)
  //     .end((result as any).body);
  // });

  // app.use('/lambda-b', async (req, res) => {
  //   const result = await lambdaLocal.execute({
  //     lambdaPath: require.resolve('@whire-be/lambda-b'),
  //     lambdaHandler: 'handler',
  //     envfile: path.join(__dirname, '.env-lambda'),
  //     event: {
  //       headers: req.headers, // Pass on request headers
  //       body: req.body, // Pass on request body
  //     },
  //   });

  //   res
  //     .status((result as any).statusCode)
  //     .set((result as any).headers)
  //     .end((result as any).body);
  // });

  const port = 3100;

  app.listen(port, () => console.log(`listening on port: ${port}`));
};

export default buildLocalServer;
