import { connect, Mongoose } from 'mongoose';
import getEnvConfig from 'packages/lambda-gq-resolver/src/config/get-env-config';

const envConfig = getEnvConfig();

let connection: Mongoose;

export const connectMongo = async (): Promise<Mongoose> => {
  connection = connection || (await connect(envConfig.db.uri, envConfig.db.options));
  return connection;
};
