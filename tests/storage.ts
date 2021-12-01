interface IState {
  [key: string]: unknown;
}

export class Storage {
  private state = {};

  set(name: string, value: unknown): void {
    this.state[name] = value;
  }

  get<T>(name: string | symbol): T {
    return this.state[name];
  }
}
