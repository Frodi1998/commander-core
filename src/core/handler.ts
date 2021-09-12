import { EventEmitter } from 'events';

import { Command, Commander } from './commander';
import { ConfigureError } from './errors';
import { IContext } from '../types';
import { Context } from '../types';
import UtilsCore from './utils';
import executeCommand from './executeCommand';

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
export interface IHandlerParams<core extends UtilsCore = undefined> {
  commands: ICommandsLoader;
  strictLoader?: boolean
  utils: core | UtilsCore;
}

/**
 * @description класс обработчика
 * @class
 */
export class Handler<core extends UtilsCore = undefined>{
  public commandsDirectory : string;

  public events: EventEmitter;

  public commander : Commander = new Commander();

  public utils: core | UtilsCore;

  private sourceCommands = '';

  private strictLoader: boolean = false;

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
    if(!params.commands.directory && !params.commands.fromArray.length) {
      throw new ConfigureError('не указан источник загрузки команд');
    }

    this.strictLoader = params.strictLoader
    
    if(!params.commands.fromArray.length && params.strictLoader) {
      throw new ConfigureError('Строгий режим загрузки! команды не найдены');
    }

    this.utils = params.utils;
    this.events = params.utils.events;
    this.commander = params.utils.commander;

    if(params.commands.fromArray.length > 0) {
      this.commander.commandsLoaded = true;
      this.commander.setCommands(params.commands.fromArray)
    }
    
    if(params.commands.directory) {
      this.commandsDirectory = params.commands.directory;
    } 

    this.sourceCommands = params.commands.fromArray.length > 0? 'array': 'directory';
  }

  /**
   * @description загружает команды из директории
   * @returns {Promise<void>}
   */
  async loadCommands(): Promise<void> {
    if(this.sourceCommands === 'array') {
      throw new ConfigureError('нельзя загружать команды из директории если указан массив комманд!');
    }

    await this.commander.loadFromDirectory(this.commandsDirectory);

    const commands = this.commander.getCommands;

    if(!commands.length && this.strictLoader) {
      throw new ConfigureError('нельзя загружать команды из директории если указан массив комманд!');
    }
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
  async execute<T extends Context>(context: T & IContext): Promise<void> {
    if(!this.commander.commandsLoaded) {
        try {
          await this.commander.loadFromDirectory(this.commandsDirectory)
        } catch(err) {
          throw new ConfigureError('не удалось загружить команды')
        }
    }

    const params = {
      context,
      utils: this.utils
    }

    this.events.emit('command_begin', params)
    
    if(!context.command) {
      context.command = context.text
    }
    
    return executeCommand<T>(context, this.utils);
  }
}