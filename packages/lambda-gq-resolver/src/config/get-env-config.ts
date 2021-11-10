import localConfig from 'packages/lambda-gq-resolver/src/test-utils/config';
import { Config, EnvType } from 'packages/lambda-gq-resolver/src/types';

// Point to test (local) or staging (cloud)
// ToDo move this to local non staged file
const env = process.env.ENV as EnvType;
// const env = EnvType.PROD;

const getCloudConfig = (): Config => {
  if (!process.env.DB_OPTIONS_USER) {
    throw new Error('Env config missing - DB_OPTIONS_USER');
  }
  if (!process.env.DB_OPTIONS_PASS) {
    throw new Error('Env config missing - DB_OPTIONS_PASS');
  }
  if (!process.env.DB_URI) {
    throw new Error('Env config missing - DB_URI');
  }
  return {
    env,
    db: {
      uri: process.env.DB_URI || 'mongodb+srv://whire-cluster-0.vkh0d.mongodb.net',
      options: { user: process.env.DB_OPTIONS_USER, pass: process.env.DB_OPTIONS_PASS, dbName: 'bla' },
    },
  };
};

const envConfig = env ? getCloudConfig() : localConfig;

const getEnvConfig = (): Config => {
  console.log('envConfig', envConfig);
  return envConfig;
};

export default getEnvConfig;
