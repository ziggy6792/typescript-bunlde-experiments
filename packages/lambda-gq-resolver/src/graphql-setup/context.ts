import { Constructable, ContainerInstance } from 'typedi';

interface IContextProps {
  requestId: string;
  container: ContainerInstance;
}

class Context {
  // Default auth it role

  public readonly requestId: string;

  public readonly container: ContainerInstance;

  constructor({ requestId, container }: IContextProps) {
    this.requestId = requestId;
    this.container = container;
  }

  getService<T extends any>(clazzType: Constructable<T>): T {
    return this.container.get(clazzType);
  }
}

export default Context;
