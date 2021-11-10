/* eslint-disable camelcase */
import { CognitoPostConfimEvent, TriggerSource } from 'src/types';
import * as api from 'src/services/gql-api';
import { initApolloClient } from 'src/utils/apollo-client';
import { commonUtils } from '@whire-be/common';
import { ENV } from 'src/config';

const addUserToModel = async (event: CognitoPostConfimEvent): Promise<CognitoPostConfimEvent> => {
  const lambdaConfig = await new commonUtils.LambdaConfig(ENV).getParamValue();

  initApolloClient({
    region: process.env.AWS_REGION,
    uri: lambdaConfig.aws_graphqlEndpoint_authRole,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  });

  const { userName } = event;

  const { userAttributes } = event.request;
  // eslint-disable-next-line camelcase
  const { email } = userAttributes;

  const user = {
    cognitoId: userName,
    email,
  };

  console.log('User Object', JSON.stringify(user));

  let savedUser: any;
  if (event.triggerSource === TriggerSource.POST_CONFIRMATION) {
    savedUser = await api.registerUser(user);
    if (!savedUser) {
      throw new Error('Unkown error calling api');
    }
    console.log('savedUser', JSON.stringify(savedUser));
  } else if (event.triggerSource === TriggerSource.POST_AUTHENTICATION) {
    // Do nothing
  }

  return event;
};

export default addUserToModel;
