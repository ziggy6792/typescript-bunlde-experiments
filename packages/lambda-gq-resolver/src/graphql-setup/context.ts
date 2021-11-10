/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';

import 'reflect-metadata';

import { ICognitoIdentity, IdentityType, IIamIdentity, IIdentity } from 'src/types';

import { Constructable, ContainerInstance } from 'typedi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIdentity = (requestContext: any): any => {
  const authIdentity = requestContext?.authorizer?.claims || requestContext?.identity;

  return authIdentity;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIdentityType = (authIdentity: any): IdentityType => {
  if (authIdentity?.username) {
    return IdentityType.USER;
  }
  if (authIdentity?.userArn) {
    if (authIdentity.cognitoAuthenticationType === 'unauthenticated') {
      return IdentityType.ROLE_UNAUTH;
    }
    return IdentityType.ROLE;
  }
  return IdentityType.NONE;
};

export interface IContext {
  req: any | null;
  readonly identity: IIdentity;
  container: ContainerInstance;
  getService<T extends any>(clazzType: Constructable<T>): T;
}

interface IContextProps {
  recieved: any;
  requestId: string;
  container: ContainerInstance;
}

class Context implements IContext {
  req: IContext['req'];

  // Default auth it role
  public readonly identity: IContext['identity'] = { type: IdentityType.ROLE };

  public readonly requestId: string;

  public readonly container: ContainerInstance;

  constructor({ recieved, requestId, container }: IContextProps) {
    this.requestId = requestId;
    this.container = container;
    if (recieved) {
      const { req } = recieved;

      this.req = req;

      const eventHeader = req.headers['x-apigateway-event'];

      const event = eventHeader ? JSON.parse(decodeURIComponent(eventHeader)) : null;

      const authIdentity = getIdentity(event?.requestContext);

      let identity: IIdentity;

      const identityType = getIdentityType(authIdentity);

      switch (identityType) {
        case IdentityType.USER:
          identity = { type: identityType, user: authIdentity as ICognitoIdentity };
          break;
        case IdentityType.ROLE:
          identity = { type: identityType, role: authIdentity as IIamIdentity };
          break;
        case IdentityType.ROLE_UNAUTH:
          identity = { type: identityType, role: authIdentity as IIamIdentity };
          break;
        default:
          identity = { type: identityType };
          break;
      }
      this.identity = identity;

      console.log('identity', identity);
    }
  }

  getService<T extends any>(clazzType: Constructable<T>): T {
    return this.container.get(clazzType);
  }
}

export default Context;
