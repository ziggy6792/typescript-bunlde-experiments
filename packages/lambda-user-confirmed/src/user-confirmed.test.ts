/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { GetParameterResult } from 'aws-sdk/clients/ssm';
import { v4 as uuidv4 } from 'uuid';
import { handler } from './user-confirmed';

import * as gqlApi from './services/gql-api';

import { CognitoPostConfimEvent } from './types';

AWSMock.setSDKInstance(AWS);

AWSMock.mock('CognitoIdentityServiceProvider', 'adminUpdateUserAttributes', (params, cb) => {
  console.log('adminUpdateUserAttributes called with', params);
  cb(null, null);
});

AWSMock.mock('CognitoIdentityServiceProvider', 'getGroup', (params, cb) => {
  console.log('getGroup called with', params);
  cb(null, null);
});

AWSMock.mock('CognitoIdentityServiceProvider', 'createGroup', (params, cb) => {
  console.log('createGroup called with', params);
  cb(null, null);
});

AWSMock.mock('CognitoIdentityServiceProvider', 'adminAddUserToGroup', (params, cb) => {
  console.log('adminAddUserToGroup called with', params);
  cb(null, null);
});

AWSMock.mock(
  'SSM',
  'getParameter',
  async (request) =>
    ({
      Parameter: {
        Value: JSON.stringify({ aws_graphqlEndpoint_authRole: 'http://localhost:3100/lambda-gq-resolver/auth-none/graphql' }),
      },
    } as GetParameterResult)
);

const mockUserId = uuidv4();

const emailSignupEvent = {
  version: '1',
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_5zmaTsBgU',
  userName: mockUserId,
  callerContext: {
    awsSdkVersion: 'aws-sdk-unknown-unknown',
    clientId: '3cegk98tmu5kqtl2jhg1jlcl0',
  },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
  request: {
    userAttributes: {
      sub: mockUserId,
      'cognito:email_alias': 'ziggy067+1@gmail.com',
      'cognito:user_status': 'CONFIRMED',
      email_verified: 'true',
      email: 'ziggy067+1@gmail.com',
    },
  },
  response: {},
} as CognitoPostConfimEvent;

const savedUser = {
  id: '1234',
};

describe('test lambda-user-confirmed', () => {
  const spyOnRegisterUser = jest.spyOn(gqlApi, 'registerUser').mockResolvedValue(savedUser);

  test('email signup', async () => {
    const mockCallback = jest.fn();

    process.env.AWS_REGION = 'ap-southeast-1';

    const actualResult = await handler(emailSignupEvent, {} as undefined, mockCallback);

    const expectedResult = {
      version: '1',
      region: 'ap-southeast-1',
      userPoolId: 'ap-southeast-1_5zmaTsBgU',
      userName: mockUserId,
      callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: '3cegk98tmu5kqtl2jhg1jlcl0',
      },
      triggerSource: 'PostConfirmation_ConfirmSignUp',
      request: {
        userAttributes: {
          sub: mockUserId,
          'cognito:email_alias': 'ziggy067+1@gmail.com',
          'cognito:user_status': 'CONFIRMED',
          email_verified: 'true',
          email: 'ziggy067+1@gmail.com',
        },
      },
      response: {},
    };

    expect(actualResult).toEqual(expectedResult);
  });
});
