import { EventEmitter } from 'events';

import { Command, Commander } from '../commander';

const ping = Symbol('ping');
const command = Symbol('command');

export class UtilsCore {
  public events = new EventEmitter();
  public commander = new Commander();

  public get getPing(): number {
    return this[ping]
  }

  public setPing(start: number): void {
    this[ping] = Date.now() - start;
  }

  public get getCommand() {
    return this[command]
  }

  public setCommand($command: Command): void {
    this[command] = $command
  }
}