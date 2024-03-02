import debug from 'debug';

import { Command, CommandContextLayer } from '../command/index.js';
import executeCommand from './executeCommand.js';
import { EventListener } from './event-emiter.js';
import { Commander } from '../commander.js';
import { AnyObject } from '../types.js';

const logger = debug('commander-core:utils');

export type CommandStatus = 'stop' | 'ready' | 'default';

export interface IUtils {
  events: EventListener;
  commander: Commander;
  get getCommand(): Command | undefined;
  setCommand<C extends Command = Command>($command: C): void;
  get getCommandStatus(): CommandStatus;
  setCommandStatus(stat: CommandStatus): CommandStatus;
  executeCommand<T extends AnyObject>(context: CommandContextLayer<T>): void;
}

/**
 * утилиты
 * @class
 */
export class UtilsCore implements IUtils {
  protected _status: CommandStatus = 'default';

  protected _command?: Command;

  protected _startTime?: number;

  /**
   * events менеджер событий
   */
  public events: EventListener;

  /**
   * менеджер команд
   * @type {Commander}
   */
  public commander: Commander;

  constructor() {
    this.events = new EventListener();
    this.commander = new Commander();
  }

  public get getPing(): number {
    if (!this._startTime) {
      this._startTime = Date.now();
      return 0;
    }

    return Date.now() - this._startTime;
  }

  public setPing(startTime: number): void {
    this._startTime = startTime;
    // this._ping = Date.now() - start;
    logger('ping: %d', Date.now() - startTime);
  }

  /**
   * возвращает текущую команду
   * @type {Command}
   */
  public get getCommand() {
    return this._command;
  }

  /**
   * статус команды
   * @return {'stop' | 'ready' | 'default'}
   */
  public get getCommandStatus(): CommandStatus {
    return this._status;
  }

  /**
   * меняет статус выполнения команды
   * @param {'stop' | 'ready' | 'default'} stat
   * @return {'stop' | 'ready' | 'default'}
   */
  public setCommandStatus(stat: CommandStatus): CommandStatus {
    if (stat) {
      this._status = stat;
    }

    return this._status;
  }

  /**
   * устанавливает команду
   * @param {Command} $command
   * @return {void}
   */
  public setCommand<C extends Command = Command>($command: C): void {
    this._command = $command;
    logger('set command: %o', this._command);
  }

  /**
   * выполняет команду по переданному контексту, аналогичен handler.execute
   * @param {IContext} context
   * @return {void}
   */
  public executeCommand<T extends AnyObject>(
    context: CommandContextLayer<T>,
  ): void {
    logger('command execute from utils');
    logger('params: context: %o, utils: %o', context, this);

    executeCommand(context, this as UtilsCore);
  }
}
