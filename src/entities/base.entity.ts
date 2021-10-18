import { modelOptions, plugin } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { ObjectType, Field } from 'type-graphql';
import paginationPlugin from 'typegoose-cursor-pagination';

@plugin(paginationPlugin)
@modelOptions({
  schemaOptions: {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },
  },
})
@ObjectType()
export class BaseEntity {
  @Field({ name: 'id' })
  readonly _id: ObjectId;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  public equals(compare: any): boolean {
    return this === compare;
  }
}
