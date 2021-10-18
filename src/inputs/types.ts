import { InputType, Field } from 'type-graphql';
import { ObjectId } from 'mongodb';

export type AddId<T> = T & IdInput;

@InputType()
export class IdInput {
  @Field()
  id: ObjectId;
}
