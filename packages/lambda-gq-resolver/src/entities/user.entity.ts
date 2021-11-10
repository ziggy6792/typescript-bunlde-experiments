import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import { Ref } from 'src/types';
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
    const names = [firstName, lastName].filter(_.identity);
    return names.join(' ');
  }

  @Field()
  @Property({ required: true })
  email: string;

  
  @Property({ type: ObjectId })
  target: Ref<User>;
}

export const UserModel = getModelForClass(User) as PaginateModel<User, typeof User>;
