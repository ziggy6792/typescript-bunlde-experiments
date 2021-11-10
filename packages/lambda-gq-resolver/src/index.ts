import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Container, { ContainerInstance } from 'typedi';
import { GraphQLRequestContext } from 'apollo-server-plugin-base';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getSchema } from './graphql-setup/get-schema';
import { connectMongo } from './utils/database';
import Context from './graphql-setup/context';

async function bootstrap() {
  // create mongoose connection
  await connectMongo();

  const schema = getSchema();
  // create GraphQL server
  const server = new ApolloServer({
    schema,
    // we need to provide unique context with `requestId` for each request
    context: (): Context => {
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
    ],
  });

  // start the server

  const app = express();
  await server.start();
  server.applyMiddleware({ app });

  const port = 4000;

  app.listen(port, () => console.log(`listening on port: ${port}`));
}

bootstrap();
