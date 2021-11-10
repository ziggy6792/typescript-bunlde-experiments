/* eslint-disable no-self-assign */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import GetOne from 'src/crud-resolver-builders/resolver-builder-get-one';
import { Arg, Query, Resolver, Int, Mutation, UseMiddleware } from 'type-graphql';
import { conditional } from 'conditional-decorator';
import { ResolverBuilder } from 'src/crud-resolver-builders/resolver-builder';
import { BaseEntity } from 'src/entities/base.entity';
import { BaseEntityResolver } from 'src/resolvers/base.entity.resolver';
import { ObjectId } from 'mongodb';
import { ApplyDefaults, Ref } from 'src/types';
import { BaseList } from 'src/objects/lists';
import { GetMany, CreateOne, CreateMany, UpdateOne, UpdateMany, DeleteOne } from '.';

interface IKeys {
  partitionKey: string;
  sortKey?: string;
}

const defaultReolverBuilders = {
  getOne: new GetOne(),
  // getMany: new GetMany(),
  deleteOne: new DeleteOne(),
};

type ResolverBuildersWithDefaults = ApplyDefaults<ResolverBuilders, typeof defaultReolverBuilders>;

interface ResolverBuilders {
  getOne?: GetOne;
  getMany?: GetMany;
  createOne?: CreateOne;
  createMany?: CreateMany;
  updateOne?: UpdateOne;
  updateMany?: UpdateMany;
  deleteOne?: DeleteOne;
}

export interface CrudConfig {
  suffix: string;
  returnType: any;
  idFields?: IKeys;
  reolverBuilders?: ResolverBuildersWithDefaults;
}

const applyDefaults = (argsWithDefaults: ResolverBuildersWithDefaults): ResolverBuilders => {
  const parseArg = <T extends ResolverBuilder>(resolverBuilder: T | true, defaultValue: T): T => {
    if (resolverBuilder === true) {
      return defaultValue;
    }
    return resolverBuilder;
  };
  Object.keys(argsWithDefaults).forEach((key) => {
    argsWithDefaults[key] = parseArg(argsWithDefaults[key], defaultReolverBuilders[key]);
  });
  return argsWithDefaults as ResolverBuilders;
};

export const buildCrudResolver = <T extends BaseEntity>(crudConfig: CrudConfig): typeof BaseEntityResolver => {
  const { reolverBuilders, returnType, suffix } = crudConfig;

  const { getOne, getMany, createOne, createMany, updateOne, updateMany, deleteOne } = applyDefaults(reolverBuilders);

  @Resolver()
  class GeneratedResolver extends BaseEntityResolver<T> {
    @conditional(!!getOne, Query(() => returnType, getOne?.getResolverOptions(suffix)))
    @UseMiddleware(getOne?.props.middleware)
    async queryGet(@Arg('id', () => ObjectId, getOne?.props.argOptions) id: Ref<T>): Promise<T> {
      return this.props.service.getOne(id);
    }

    // @conditional(!!getMany, Query(() => [returnType], getMany?.getResolverOptions(suffix)))
    // @UseMiddleware(getMany?.props.middleware)
    // async queryGetMany(@Arg('limit', () => Int, { nullable: true }) limit: number): Promise<T[]> {
    //   return this.props.service.getMany(limit);
    // }

    @conditional(!!getMany, Query(() => getMany?.props.listType, getMany?.getResolverOptions(suffix)))
    async queryGetMany(
      @Arg('limit', () => Int, { nullable: true }) limit: number,
      @Arg('nextCursor', { nullable: true }) nextCursor: string
    ): Promise<BaseList<T>> {
      console.log('here!');
      const list = await this.props.service.getMany(limit, nextCursor);
      console.log('list', list);
      const ListType = getMany?.props.listType as typeof BaseList;
      return new ListType(list);
    }

    @conditional(!!createOne, Mutation(() => returnType, createOne?.getResolverOptions(suffix)))
    @UseMiddleware(createOne?.props.middleware)
    async mutationCreateOne(@Arg('input', () => createOne?.props.inputType, createOne?.props.argOptions) input: any): Promise<T> {
      return this.props.service.createOne(input);
    }

    @conditional(!!createMany, Mutation(() => [returnType], createMany?.getResolverOptions(suffix)))
    @UseMiddleware(createMany?.props.middleware)
    async mutationCreateMany(@Arg('input', () => [createMany?.props.inputType], createMany?.props.argOptions) input: T[]): Promise<T[]> {
      return this.props.service.createMany(input);
    }

    @conditional(!!updateOne, Mutation(() => returnType, updateOne?.getResolverOptions(suffix)))
    @UseMiddleware(updateOne?.props.middleware)
    async mutationUpdateOne(@Arg('input', () => updateOne?.props.inputType, updateOne?.props.argOptions) input: any): Promise<T> {
      return this.props.service.updateOne(input);
    }

    @conditional(!!updateMany, Mutation(() => [returnType], updateMany?.getResolverOptions(suffix)))
    @UseMiddleware(updateMany?.props.middleware)
    async mutationUpdateMany(@Arg('input', () => [updateMany?.props.inputType], updateMany?.props.argOptions) input: any[]): Promise<T[]> {
      return this.props.service.updateMany(input);
    }

    @conditional(deleteOne && !deleteOne.props.inputType, Mutation(() => returnType, deleteOne?.getResolverOptions(suffix)))
    @UseMiddleware(deleteOne?.props.middleware)
    async mutationDeleteOneId(@Arg('id', () => ObjectId) id: Ref<T>): Promise<T> {
      return this.props.service.deleteOne(id);
    }

    @conditional(!!deleteOne?.props.inputType, Mutation(() => returnType, deleteOne?.getResolverOptions(suffix)))
    @UseMiddleware(deleteOne?.props.middleware)
    async mutationDeleteOneInput(@Arg('input', () => deleteOne?.props.inputType, deleteOne?.props.argOptions) input: T): Promise<T> {
      throw new Error('Not Implemented');
    }
  }
  return GeneratedResolver as typeof BaseEntityResolver;
};
