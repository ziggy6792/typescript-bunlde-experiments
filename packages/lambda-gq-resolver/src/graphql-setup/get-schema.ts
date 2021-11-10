import { buildSchemaSync, ResolverData } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { ObjectId } from 'mongodb';

import { HelloWorldResolver } from 'packages/lambda-gq-resolver/src/resolvers/hello-world.resolver';
import { UserResolver } from 'packages/lambda-gq-resolver/src/resolvers/user.resolver';
import { TypegooseMiddleware } from './typegoose-middleware';
import { ObjectIdScalar } from './object-id.scalar';
import Context from './context';

let schema: GraphQLSchema;

export const getSchema = () => {
  schema =
    schema ||
    buildSchemaSync({
      resolvers: [HelloWorldResolver, UserResolver],
      // register our custom, scoped IOC container by passing a extracting from resolver data function
      container: ({ context }: ResolverData<Context>) => context.container,
      // use document converting middleware
      globalMiddlewares: [TypegooseMiddleware],
      // use ObjectId scalar mapping
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
      dateScalarMode: 'isoDate',
    });
  return schema;
};
