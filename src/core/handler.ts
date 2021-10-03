import debug from 'debug';

import { Command, Commander } from './commander';
import { ConfigureError } from './errors';
import { IContext } from '../types';
import { Context } from '../types';
import { UtilsCore } from './utils';
import EventListener from './utils/event-emiter';
import executeCommand from './executeCommand';

const logger = debug('commander-core:handler');

/**
 * @description источники загрузок
 * @interface
 */
interface ICommandsLoader {
  /**
   * @description директория
   */
  directory?: string;

  /**
   * @description массив, при указании этого источника директория будет игнорироваться
   */
  fromArray?: Command[];
}

/**
 * @interface
 */
export interface IHandlerParams {
  /**
   * @description объект описывающий источник загрузок
   */
  commands: ICommandsLoader;

  /**
   * @description строгий режим, гарантирующий что при загрузке будет хотя бы 1 команда иначе бросит ошибку
   * @default true
   */
  strictLoader?: boolean

  /**
   * @description настраиваемые утилиты для вашей логики, например для работы с базой данных
   */
  utils: UtilsCore;
}

/**
 * @description класс обработчика
 * @class
 */
export class Handler {
  /**
   * @type {EventEmitter} events менеджер событий
   */
  readonly events: EventListener;

  readonly commander: Commander;

  readonly utils: UtilsCore;

  private readonly commandsDirectory: string;

  private sourceCommands = '';

  private strictLoader = false;

  /**
   * @description конструктор
   * @param {IHandlerParams} data данные обработчика
   * @returns {handler}
   * @example
   * 
   * const { Handler, UtilsCore } = require('commander-core');
   * 
   * class Utils extends UtilsCore {
   *  testMetods() {
   *      console.log('test')
   *  }
   * }
   * 
   * const handler = new Handler({
   *  commands: {
   *    directory: path.resolve(__dirname, 'commands'); //директория команд
   *  },
   *  strictLoader: true // строгая загрузка
   *  utils: new Utils() // Utils
   * })
   * @example
   * 
   * сonst handler = new Handler({
   *  commands: {
   *    fromArray: [new Command(params)]; //массив команд
   *  },
   *  strictLoader: true // строгая загрузка
   *  utils: new Utils() // Utils
   * })
   */
  constructor(params: IHandlerParams = {
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
    return executeCommand<C>(context, this.utils);
  }
}