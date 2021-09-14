import { EventEmitter } from 'events';
import debug from 'debug';

import { Command, Commander } from './commander';
import { ConfigureError } from './errors';
import { IContext } from '../types';
import { Context } from '../types';
import { UtilsCore } from './utils';
import executeCommand from './executeCommand';

const logger = debug('commander-core:handler');

/**
 * @interface
 */
interface ICommandsLoader {
  directory?: string;
  fromArray?: Command[];
}

/**
 * @interface
 */
export interface IHandlerParams<core extends UtilsCore> {
  commands: ICommandsLoader;
  strictLoader?: boolean
  utils: core | UtilsCore;
}

/**
 * @description класс обработчика
 * @class
 */
export class Handler<core extends UtilsCore>{
  public commandsDirectory : string;

  public events: EventEmitter;

  public commander : Commander;

  public utils: core | UtilsCore;

  private sourceCommands = '';

  private strictLoader = false;

  /**
   * @description конструктор
   * @param {IHandlerParams} data данные обработчика
   * @returns {handler}
   * @example js
   * 
   * const params = {
   *  testMetods() {
   *      console.log('test')
   *  }
   * }
   * 
   * const handler = new Handler({
   *  commandsDirectory: path.resolve + '/commands',
   *  params: params
   * })
   * 
   * @example ts
   * 
   * import { IParams, Handler } from "commander-core";
   * 
   * class Params implements IParams {
   *  testMetods() {
   *      console.log('test')
   *  }
   * }
   * 
   * const handler = new Handler<Params>({
   *  commandsDirectory: path.resolve + '/commands',
   *  params: new Params();
   * })
   */
  constructor(params: IHandlerParams<core> = {
    commands: {},
    strictLoader: false,
    utils: new UtilsCore()
  }) {
    logger('create handler start');
    this.strictLoader = params.strictLoader

    logger('strictLoader: %s', this.strictLoader);

    if(!params.commands.directory && !params.commands.fromArray?.length) {
      throw new ConfigureError('не указан источник загрузки команд');
    }
    
    if (params.strictLoader
      && !params.commands.fromArray?.length
      && !params.commands.directory) {
      throw new ConfigureError('Строгий режим загрузки! команды не найдены');
    }

    this.utils = params.utils;
    logger('handler.utils: %o', this.utils);
    
    this.events = params.utils.events;
    logger('handler.events: %o', this.events);

    this.commander = params.utils.commander;
    logger('handler.commander: %o', this.commander);

    if(params.commands.fromArray?.length > 0) {
      this.commander.commandsLoaded = true;
      this.commander.setCommands(params.commands.fromArray)
    }
    
    if(params.commands.directory) {
      this.commandsDirectory = params.commands.directory;
    } 

    this.sourceCommands = params.commands.fromArray?.length > 0? 'array': 'directory';
    logger('sourceCommands: %s', this.sourceCommands)
    logger('create handler complited');
  }

  get [Symbol.toStringTag](): string {
		return 'Handler';
	}

  /**
   * @description загружает команды из директории
   * @returns {Promise<void>}
   */
  async loadCommands(): Promise<void> {
    logger('booting commands');

    if(this.sourceCommands === 'array') {
      throw new ConfigureError('нельзя загружать команды из директории если указан массив комманд!');
    }

    await this.commander.loadFromDirectory(this.commandsDirectory);

    const commands: Command[] = this.commander.getCommands;
    logger('commands count: %d', commands.length);

    if(commands.length < 1 && this.strictLoader) {
      logger('booting commands error');
      throw new ConfigureError('Строгий режим загрузки! команды не найдены');
    }
    
    logger('handler.commander: %o', this.commander);
    logger('booting commands complited');
  }

  /**
   * @description обработка команды
   * @param {object} context объект контекста возвращаемый из vk-io или puregram
   * @returns {void}
   * @example
   * 
   * execute<MessageContext>(context)
   * // => void
   */
  async execute<C extends Context>(context: C & IContext): Promise<void> {
    logger('start command processing');

    if(!this.commander.commandsLoaded) {
        try {
          await this.commander.loadFromDirectory(this.commandsDirectory)
        } catch(err) {
          throw new ConfigureError('не удалось загружить команды')
        }
    }

    this.events.emit('command_begin', {context, utils: this.utils});
    
    if(!context.$command) {
      context.$command = context.text
    }
    
    return executeCommand<C, core | UtilsCore>(context, this.utils);
  }
}