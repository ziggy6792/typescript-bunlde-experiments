/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';

import * as lambda from 'aws-lambda';
import { CognitoPostConfimEvent, TriggerSource } from './types';
import addToGroup from './handlers/add-to-group';
import addUserToModel from './handlers/add-to-model';

export const handler = async (
  event: CognitoPostConfimEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
): Promise<CognitoPostConfimEvent> => {
  console.log('Recieved', JSON.stringify(event));

  const envLogText = `
  AWS_REGION = ${process.env.AWS_REGION}
  AWS_ACCESS_KEY_ID = ${process.env.AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY = ${process.env.AWS_SECRET_ACCESS_KEY}
  AWS_SESSION_TOKEN = ${process.env.AWS_SESSION_TOKEN}
  `;

  console.log('env short', envLogText);

  try {
    if ('identities' in event.request.userAttributes) {
      // Is federated signin
    }
    if (event.triggerSource === TriggerSource.POST_CONFIRMATION) {
      await addToGroup(event);
    }
    await addUserToModel(event);
  } catch (err) {
    console.log('error', JSON.stringify(err));
    callback(err);
    throw err;
  }

  return event;
};
