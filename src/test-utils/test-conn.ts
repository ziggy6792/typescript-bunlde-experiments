import { connectMongo } from 'src/utils/database';
import { dbDefault } from './mock-db';
import mockDbUtils from './mock-db/mock-db-utils';

// const { awsConfig } = getEnvConfig();

const testConn = async (): Promise<void> => {
  // AWS.config.update(awsConfig);

  await mockDbUtils.populateDb(dbDefault);
};

export default testConn;
