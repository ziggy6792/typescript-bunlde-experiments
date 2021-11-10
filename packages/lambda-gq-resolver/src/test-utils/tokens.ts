import Context from 'packages/lambda-gq-resolver/src/graphql-setup/context';
import { Token } from 'typedi';

export const TEST_CONTEXT = new Token<Context>('TEST_CONTEXT');
