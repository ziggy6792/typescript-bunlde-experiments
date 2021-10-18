import { GraphQLScalarType, Kind } from 'graphql';
import { Timecode } from 'src/timecode';

export const TimecodeScalar = new GraphQLScalarType({
  name: 'Timecode',
  description: 'Timecode scalar type',
  serialize(value: unknown): string {
    if (!(value instanceof Timecode)) {
      throw new Error('TimecodeScalar can only serialize Timecode values');
    }
    return value.toString();
  },
  parseValue(value: unknown): Timecode {
    if (typeof value !== 'string') {
      throw new Error('TimecodeScalar can only parse string values');
    }
    return new Timecode(value);
  },
  parseLiteral(ast): Timecode {
    if (ast.kind !== Kind.STRING) {
      throw new Error('TimecodeScalar can only parse string values');
    }
    return new Timecode(ast.value);
  },
});
