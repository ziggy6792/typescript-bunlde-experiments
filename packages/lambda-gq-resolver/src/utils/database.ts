import { connect, Mongoose } from 'mongoose';
import getEnvConfig from 'src/config/get-env-config';

const envConfig = getEnvConfig();

let connection: Mongoose;

export const connectMongo = async (): Promise<Mongoose> => {
  connection = connection || (await connect(envConfig.db.uri, { ...envConfig.db.options, connectTimeoutMS: 100 }));
  return connection;
};
