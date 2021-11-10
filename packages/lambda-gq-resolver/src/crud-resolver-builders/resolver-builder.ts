/* eslint-disable no-useless-constructor */

import { AdvancedOptions } from 'type-graphql/dist/decorators/types';
import { IResolverBuilderProps } from './types';

export abstract class ResolverBuilder {
  protected props: IResolverBuilderProps;

  constructor(props: IResolverBuilderProps) {
    this.props = props || { middleware: [] };
    this.props.middleware = this.props.middleware || [];
  }

  public getResolverOptions(suffix: string): AdvancedOptions {
    return { name: this.getResolverName(suffix), ...this.props.resolverOptions };
  }

  protected abstract getResolverName(suffix: string): string;
}
