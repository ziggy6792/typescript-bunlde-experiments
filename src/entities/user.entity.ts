import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { PaginateModel } from 'typegoose-cursor-pagination';
import { BaseEntity } from './base.entity';

@ObjectType()
export class User extends BaseEntity {
  @Field()
  @Property()
  firstName: string;

  @Field()
  @Property()
  lastName: string;

  @Field()
  @Property({ required: true })
  cognitoId: string;

  @Field({ name: 'fullName' })
  getFullName(): string {
    const { firstName, lastName } = this;
    return `${firstName}${lastName ? ` ${lastName}` : ''}`;
  }

  @Field()
  @Property({ required: true })
  email: string;
}

export const UserModel = getModelForClass(User) as PaginateModel<User, typeof User>;
