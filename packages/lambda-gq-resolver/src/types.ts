/* eslint-disable camelcase */
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

export enum IdentityType {
  ROLE = 'role',
  USER = 'user',
  ROLE_UNAUTH = 'role_unauth',
  NONE = 'none',
}
export interface IIdentity {
  type: IdentityType;
  user?: ICognitoIdentity;
  role?: IIamIdentity;
}

export interface ICognitoIdentity {
  sub: string;
  'cognito:groups': string;
  token_use: string;
  scope: string;
  auth_time: string;
  iss: string;
  exp: string;
  iat: string;
  version: string;
  jti: string;
  client_id: string;
  username: string;
}

export interface IIamIdentity {
  cognitoIdentityPoolId: string;
  accountId: string;
  cognitoIdentityId: string;
  caller: string;
  sourceIp: string;
  principalOrgId?: null;
  accessKey: string;
  cognitoAuthenticationType: string;
  cognitoAuthenticationProvider?: null;
  userArn: string;
  userAgent: string;
  user: string;
}

export interface IDecodedJWT {
  header: IHeader;
  payload: ICognitoIdentity;
  signature: string;
}
export interface IHeader {
  kid: string;
  alg: string;
}

export interface IEvent {
  identity: ICognitoIdentity;
}

export type ApplyDefaults<Type, Defaults> =
  | {
      [Property in keyof Type]: Type[Property];
    }
  | {
      [Property in keyof Defaults]?: Defaults[Property] | true;
    };
