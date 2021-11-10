/* eslint-disable import/prefer-default-export */
import { ExecutionResult, graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import Container from 'typedi';
import { getSchema } from 'src/graphql-setup/get-schema';
import { TEST_CONTEXT } from './tokens';

interface IOptions {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

const schema = getSchema();

export const gCall = async ({ source, variableValues }: IOptions, throwError = true): Promise<ExecutionResult> => {
  const testContext = Container.get(TEST_CONTEXT);

  const response = await graphql({
    schema,
    source,
    variableValues,
    contextValue: testContext,
  });
  if (throwError && response?.errors) {
    throw new Error(JSON.stringify(response.errors));
  }
  return response;
};
