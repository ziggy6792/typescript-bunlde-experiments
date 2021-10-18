/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */

import pluralize from 'pluralize';
import { ResolverBuilder } from './resolver-builder';
import { IResolverBuilderProps } from './types';

interface IGetManyBuilderProps extends IResolverBuilderProps {
  listType: any;
}

export default class GetMany extends ResolverBuilder {
  public readonly props: IGetManyBuilderProps;

  constructor(props: IGetManyBuilderProps) {
    super(props);
  }

  getResolverName(suffix: string): string {
    return `list${pluralize.plural(suffix)}`;
  }
}
