// ToDo : delete this

import { BaseEntity } from 'src/entities/base.entity';
import Context from 'src/graphql-setup/context';
import BaseEntityService from 'src/services/base-entity.service';
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
