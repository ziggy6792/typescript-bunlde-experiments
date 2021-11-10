import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Container, { ContainerInstance } from 'typedi';
import { GraphQLRequestContext } from 'apollo-server-plugin-base';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';

import cors from 'cors';
import * as serverless from 'aws-serverless-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { getSchema } from './graphql-setup/get-schema';
import { connectMongo } from './utils/database';
import Context from './graphql-setup/context';

const createApolloServer = async (): Promise<ApolloServer> => {
  // create mongoose connection
  await connectMongo();

  const schema = getSchema();
  // create GraphQL server
  return new ApolloServer({
    schema,
    // we need to provide unique context with `requestId` for each request
    context: (recieved: any): Context => {
      const requestId = uuidv4(); // uuid-like
      const container = Container.of(requestId.toString()); // get scoped container
      const context = new Context({ requestId, container }); // create our context
      container.set('context', context); // place context or other data in container
      return context;
    },
    // create a plugin that will allow for disposing the scoped container created for every request
    plugins: [
      {
        requestDidStart: async (requestContext: GraphQLRequestContext<Context>) => {
          // remember to dispose the scoped container to prevent memory leaks
          Container.reset(requestContext.context.requestId.toString());
          // for developers curiosity purpose, here is the logging of current scoped container instances
          // we can make multiple parallel requests to see in console how this works
          const instancesIds = ((Container as any).instances as ContainerInstance[]).map((instance) => instance.id);
          console.log('instances left in memory:', instancesIds);
        },
      },
    ], // TODO: remove when fixed: https://github.com/apollographql/apollo-server/pull/3525
  });
};

//

let server: Server;
const startServer = async () => {
  const app = express();
  app.use(cors({ allowedHeaders: '*', origin: '*', methods: '*' }));
  const apolloServer = await createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '*' });
  return serverless.createServer(app);
};

const addGqlMiddleware = (app: express.Express) => {
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
};

const handler = async (event, context, callback) => {
  const logText = `
  partialConnection.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '${process.env.AWS_ACCESS_KEY_ID}';
  partialConnection.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '${process.env.AWS_SECRET_ACCESS_KEY}';
  partialConnection.AWS_SESSION_TOKEN =
    process.env.AWS_SESSION_TOKEN ||
    // eslint-disable-next-line max-len
    '${process.env.AWS_SESSION_TOKEN}' `;

  // console.log(logText.fuck);

  console.log('handler event', JSON.stringify(event));

  server = server || (await startServer());

  try {
    // return serverless.proxy(server, event, context);
    return await serverless.proxy(server, event, context, 'PROMISE').promise;
  } catch (err) {
    console.log('error', err);
    callback(err);
    return err;
  }
};
//
export { createApolloServer, handler, addGqlMiddleware };
