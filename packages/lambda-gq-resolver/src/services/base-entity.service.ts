/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
import { Inject } from 'typedi';
import { MongooseUpdate, Ref, BaseEntityModel } from 'src/types';
import Context from 'src/graphql-setup/context';
import { BaseEntity } from 'src/entities/base.entity';
import { AddId } from 'src/inputs/types';
import { IPaginateOptions, IPaginateResult } from 'typegoose-cursor-pagination';

export default class BaseEntityService<T extends BaseEntity> {
  @Inject('context') protected readonly context: Context;

  constructor(private model: BaseEntityModel<T>) {}

  async getOne(id: Ref<T>): Promise<T> {
    if (!id) {
      return null;
    }
    return this.model.findById(id);
  }

  getPaginateOptions(limit: number, nextCursor: string): IPaginateOptions {
    return {
      sortField: 'createdAt',
      sortAscending: true,
      limit,
      next: nextCursor,
    };
  }

  async getMany(limit?: number, nextCursor?: string, filter?: Partial<T>): Promise<IPaginateResult<T>> {
    const options = this.getPaginateOptions(limit, nextCursor);
    console.log('EXECUTE', options);
    return this.model.findPaged(options, filter);
  }

  public async createOne(input: Partial<T>): Promise<T> {
    return this.model.create(input);
  }

  public async updateOne(input: AddId<Partial<T>>): Promise<T> {
    return this.model.findByIdAndUpdate(input.id, input as any, { new: true });
  }

  public async updateMany(input: AddId<Partial<T>>[]): Promise<T[]> {
    throw new Error('Not Implemented');
  }

  public async createMany(inputs: Partial<T>[]): Promise<T[]> {
    return this.model.create(inputs);
  }

  public async deleteOne(partitionKey: Ref<T>): Promise<T> {
    return this.model.findByIdAndDelete(partitionKey);
  }
}
