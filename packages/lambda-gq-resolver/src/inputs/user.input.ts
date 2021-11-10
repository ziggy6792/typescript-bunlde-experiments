/* eslint-disable max-classes-per-file */
import { User } from 'packages/lambda-gq-resolver/src/entities/user.entity';
import { InputType, Field } from 'type-graphql';
import { IdInput } from './types';

@InputType()
export class UpdateUserInput extends IdInput implements Partial<User> {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  email: string;
}

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field()
  email: string;

  @Field()
  cognitoId: string;
}
