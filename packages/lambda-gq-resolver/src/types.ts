import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { ObjectId } from 'mongodb';
import { ConnectOptions, LeanDocument, ReadonlyPartial, __UpdateQueryDef } from 'mongoose';
import { PaginateModel } from 'typegoose-cursor-pagination';
import { BaseEntity } from './entities/base.entity';

export type Ref<T> = T | ObjectId;

export type MongooseUpdate<T> = ReadonlyPartial<__UpdateQueryDef<LeanDocument<DocumentType<T, BeAnObject>>>>;

export type BaseEntityModel<T extends BaseEntity> = PaginateModel<T, typeof BaseEntity>;

export enum EnvType {
  STAGING = 'staging',
  PROD = 'prod',
  TEST = 'test',
}

export interface Config {
  env: EnvType;
  db: {
    uri: string;
    options: ConnectOptions;
  };
}

export type ApplyDefaults<Type, Defaults> =
  | {
      [Property in keyof Type]: Type[Property];
    }
  | {
      [Property in keyof Defaults]?: Defaults[Property] | true;
    };
