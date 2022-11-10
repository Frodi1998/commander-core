import debug from 'debug';

import { Context, IContext } from '../../types';
import { Command, Commander } from '../commander';
import executeCommand from '../executeCommand';
import EventListener from './event-emiter';

const ping = Symbol('ping');
const command = Symbol('command');
const status = Symbol('status');

const logger = debug('commander-core:utils');

type TStatus = 'stop' | 'ready' | 'default';

/**
 * @description утилиты
 * @class
 */
export class UtilsCore {
  [status]: TStatus = 'default';

  /**
   * @type {EventEmitter} events менеджер событий
   */
  public events: EventListener;

  /**
   * @description менеджер команд
   * @type {Commander}
   */
  public commander: Commander;

  constructor() {
    this.events = new EventListener();
    this.commander = new Commander();
  }

  public get getPing(): number {
    return this[ping];
  }

  public setPing(start: number): void {
    this[ping] = Date.now() - start;
    logger('ping: %d', this[ping]);
  }

  /**
   * @description возвращает текущую команду
   * @type {Command}
   */
  public get getCommand(): Command {
    return this[command];
  }

  /**
   * статус команды
   * @return {'stop' | 'ready' | 'default'}
   */
  public get getCommandStatus(): TStatus {
    return this[status];
  }

  /**
   * меняет статус выполнения команды
   * @param {'stop' | 'ready' | 'default'} stat
   * @return {'stop' | 'ready' | 'default'}
   */
  public setCommandStatus(stat: TStatus): TStatus {
    if (stat) {
      this[status] = stat;
    }

    return this[status];
  }

  /**
   * @description устанавливает команду
   * @param {Command} $command
   * @return {void}
   */
  public setCommand($command: Command): void {
    this[command] = $command;
    logger('set command: %o', this[command]);
  }

  /**
   * @description выполняет команду по переданному контексту, аналогичен handler.execute
   * @param {IContext} context
   * @return {void}
   */
  public executeCommand<ctx extends Context>(context: ctx & IContext): void {
    logger('command execute from utils');
    logger('params: context: %o, utils: %o', context, this);

    executeCommand<ctx>(context, this);
  }
}
