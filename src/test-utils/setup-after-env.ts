import 'reflect-metadata';

import * as getEnvConfig from 'src/config/get-env-config';
import Context from 'src/graphql-setup/context';
import Container from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import localConfig from './config';
import { TEST_CONTEXT } from './tokens';

// Ignore what is set in config and force test env config
// ToDo: re-enable tests
// jest.spyOn(getEnvConfig, 'default').mockReturnValue(localConfig);

Container.set({
  id: TEST_CONTEXT,
  transient: true, // create a fresh copy for each `get`
  factory: () => {
    const requestId = uuidv4();
    const container = Container.of(requestId); // get scoped container
    const context = new Context({ requestId, container }); // create our context
    container.set('context', context);
    return context;
  },
});
