/* eslint-disable no-useless-constructor */

import { Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { buildCrudResolver, CreateOne, GetMany, UpdateOne } from 'src/crud-resolver-builders';
import { CreateUserInput, UpdateUserInput } from 'src/inputs/user.input';
import { UserList } from 'src/objects/lists';
@Service()
@Resolver((of) => User)
export class UserResolver extends buildCrudResolver({
  returnType: User,
  suffix: 'User',
  reolverBuilders: {
    getOne: true,
    deleteOne: true,
    getMany: new GetMany({ listType: UserList }),
    createOne: new CreateOne({ inputType: CreateUserInput }),
    updateOne: new UpdateOne({ inputType: UpdateUserInput }),
  },
})<User> {
  constructor(private readonly userService: UserService) {
    super({ service: userService });
  }
}
