import debug from 'debug';

import { Command, IContext, Context } from './command/index.js';
import { ConfigureError } from './errors/index.js';
import { UtilsCore, EventListener } from './util/index.js';
import executeCommand from './util/executeCommand.js';
import { Commander } from './commander.js';

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
   * объект описывающий источник загрузок
   * @type {ICommandsLoader}
   */
  commands: ICommandsLoader;

  /**
   * строгий режим, гарантирующий что при загрузке будет хотя бы 1 команда иначе бросит ошибку
   * @type {boolean}
   * @default true
   */
  strictLoader?: boolean;

  /**
   * настраиваемые утилиты для вашей логики, например для работы с базой данных
   * @type {UtilsCore}
   */
  utils: UtilsCore;
}

/**
 * @description класс обработчика
 * @class
 * @param {IHandlerParams} data данные обработчика
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
export class Handler {
  /**
   * @type {EventEmitter} events менеджер событий
   */
  readonly events: EventListener;
  readonly commander: Commander;
  readonly utils: UtilsCore;

  private readonly commandsDirectory!: string;
  private sourceCommands = '';
  private strictLoader = false;

  constructor(
    data: IHandlerParams = {
      commands: {},
      strictLoader: false,
      utils: new UtilsCore(),
    },
  ) {
    logger('create handler start');
    this.strictLoader = data.strictLoader || false;

    logger('strictLoader: %s', this.strictLoader);

    if (!data.commands.directory && !data.commands.fromArray?.length) {
      throw new ConfigureError('не указан источник загрузки команд');
    }

    if (
      data.strictLoader &&
      !data.commands.fromArray?.length &&
      !data.commands.directory
    ) {
      throw new ConfigureError('Строгий режим загрузки! команды не найдены');
    }

    this.utils = data.utils;
    logger('handler.utils: %o', this.utils);

    this.events = data.utils.events;
    logger('handler.events: %o', this.events);

    this.commander = data.utils.commander;
    logger('handler.commander: %o', this.commander);

    if ((data.commands.fromArray?.length as number) > 0) {
      this.commander.commandsLoaded = true;
      this.commander.setCommands(data.commands.fromArray as Command[]);
    }

    if (data.commands.directory) {
      this.commandsDirectory = data.commands.directory || '';
    }

    this.sourceCommands =
      (data.commands.fromArray?.length as number) > 0 ? 'array' : 'directory';
    logger('sourceCommands: %s', this.sourceCommands);
    logger('create handler complited');
  }

  get [Symbol.toStringTag](): string {
    return 'Handler';
  }

  /**
   * @description загружает команды из директории
   * @return {Promise<void>}
   */
  async loadCommands(): Promise<boolean> {
    if (this.sourceCommands === 'array') {
      throw new ConfigureError(
        'нельзя загружать команды из директории если указан массив комманд!',
      );
    }

    logger('booting commands');
    const isLoaded = await this.commander.loadFromDirectory(
      this.commandsDirectory as string,
    );

    logger('isLoaded: %s', isLoaded);
    if (!isLoaded) {
      return false;
    }

    const commands: Command[] = this.commander.getCommands;
    logger('commands count: %d', commands.length);

    if (commands.length < 1 && this.strictLoader) {
      logger('booting commands error');
      throw new ConfigureError('Строгий режим загрузки! команды не найдены');
    }

    logger('handler.commander: %o', this.commander);
    logger('booting commands complited');
    return true;
  }

  /**
   * @description обработка команды
   * @param {object} context объект контекста возвращаемый из vk-io или puregram
   * @return {void}
   * @example
   *
   * execute<MessageContext>(context)
   * // => void
   */
  async execute<C extends Context>(context: C & IContext): Promise<void> {
    return executeCommand<C>(context, this.utils);
  }
}
