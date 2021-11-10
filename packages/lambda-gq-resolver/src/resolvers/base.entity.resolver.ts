// ToDo : delete this

import { BaseEntity } from 'packages/lambda-gq-resolver/src/entities/base.entity';
import Context from 'packages/lambda-gq-resolver/src/graphql-setup/context';
import BaseEntityService from 'packages/lambda-gq-resolver/src/services/base-entity.service';
import { Inject } from 'typedi';

interface ICrudProps<T extends BaseEntity> {
  service: BaseEntityService<T>;
}

export abstract class BaseEntityResolver<T extends BaseEntity> {
  protected props: ICrudProps<T>;

  @Inject('context') protected readonly context: Context;

  constructor(props: ICrudProps<T>) {
    this.props = props;
  }
}
