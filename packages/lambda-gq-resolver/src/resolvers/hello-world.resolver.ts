/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */

import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

@Service()
@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'Hello World!';
  }
}
