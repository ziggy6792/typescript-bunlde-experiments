import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';

import { UserModel } from 'src/entities/user.entity';
import { connectMongo } from 'src/utils/database';
import { IMockDb } from './types';

const modelMap = {
  users: UserModel,
};

const populateDb = async (mockDb: IMockDb): Promise<void> => {
  const mongoose = await connectMongo();
  await mongoose.connection.db.dropDatabase();
  const putFns = Object.keys(mockDb).map((key: keyof IMockDb) => {
    const dbItems = mockDb[key];
    const model: ReturnModelType<AnyParamConstructor<any>> = modelMap[key];
    return async () => model.create(dbItems);
  });
  await Promise.all(putFns.map((fn) => fn()));
};

const dbToJson = async () => {
  const retJson: IMockDb = {};
  const scanFns = Object.keys(modelMap).map((key: keyof typeof modelMap) => async () => {
    retJson[key] = await (modelMap[key] as ReturnModelType<AnyParamConstructor<any>>).find();
  });
  await Promise.all(scanFns.map((fn) => fn()));
  return retJson;
};

const mockDbUtils = {
  populateDb,
  dbToJson,
};

export default mockDbUtils;
