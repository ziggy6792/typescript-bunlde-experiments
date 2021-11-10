import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo object id scalar type',
  serialize(value: any): string {
    if ('toHexString' in value) {
      return value.toHexString();
    }
    throw new Error('ObjectIdScalar can only serialize ObjectId values');
  },
  parseValue(value: unknown): ObjectId {
    if (typeof value !== 'string') {
      throw new Error('ObjectIdScalar can only parse string values');
    }
    return new ObjectId(value);
  },
  parseLiteral(ast): ObjectId {
    if (ast.kind !== Kind.STRING) {
      throw new Error('ObjectIdScalar can only parse string values');
    }
    return new ObjectId(ast.value);
  },
});
