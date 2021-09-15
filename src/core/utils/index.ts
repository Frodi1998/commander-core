import { EventEmitter } from 'events';
import debug from 'debug';

import { Context, IContext } from '../../types';
import { Command, Commander } from '../commander';
import executeCommand from '../executeCommand';

const ping = Symbol('ping');
const command = Symbol('command');

const logger = debug('commander-core:utils');

/**
 * @description утилиты
 * @class
 */
export class UtilsCore {
  /**
   * @description менеджер событий
   */
  public events = new EventEmitter();

  /**
   * @description менеджер команд
   */
  public commander = new Commander();

  public get getPing(): number {
    return this[ping]
  }

  public setPing(start: number): void {
    this[ping] = Date.now() - start;
    logger('ping: %d', this[ping]);
  }

  /**
   * @description возвращает текущую команду
   * @return {Command}
   */
  public get getCommand(): Command {
    return this[command];
  }

  /**
   * @description устанавливает команду
   * @param $command 
   */
  public setCommand($command: Command): void {
    this[command] = $command
    logger('set command: %o', this[command]);
  }

  public executeCommand<ctx extends Context>(context: ctx & IContext) {
    logger('command execute from utils');
    logger('params: context: %o, utils: %o', context, this);
    
    this.events.emit('command_begin', {context, utils: this});
    
    if(!context.$command) {
      context.$command = context.text
    }

    executeCommand<ctx>(context, this)
  }
}