import Context from 'src/graphql-setup/context';
import { Token } from 'typedi';

export const TEST_CONTEXT = new Token<Context>('TEST_CONTEXT');
