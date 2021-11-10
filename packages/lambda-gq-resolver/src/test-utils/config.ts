import { Config, EnvType } from 'packages/lambda-gq-resolver/src/types';

const localConfig: Config = {
  env: EnvType.TEST,
  db: { uri: 'mongodb://localhost:27016/', options: {} },
};

export default localConfig;
