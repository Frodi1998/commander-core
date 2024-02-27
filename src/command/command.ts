import { ConfigureError } from '../errors/index.js';
import { AnyObject } from '../types.js';
import { UtilsCore } from '../util/utils-core.js';
import { Context, ICommand, IContext, THandlerCommand } from './types.js';

/**
 * @description Класс команды
 * @class
 * @param {ICommand} data
 *
 * @example
 * new Command({
 *
 *  name: 'test',
 *  description: 'test command',
 *  categories: ['test'],
 *
 *  params: {
 *      emoji: '📄'
 * },
 *
 *  handler(context) {
 *      context.send('test');
 *  }
 * })
 *  pattern: /test/i,
 */
export class Command<C = AnyObject, U = UtilsCore> {
  /**
   * паттерн команды
   * @property {RegExp | string}
   * @memberof Command
   */
  public pattern: RegExp | string;

  /**
   * обработчик комманды
   * @property {THandlerCommand} handler
   */
  public handler: THandlerCommand<C, U>;

  /**
   * название
   * @property {string}
   */
  public name: string;

  /**
   * @description описание
   * @property {string} description
   */
  public description: string;

  /**
   * @type {string[]}
   */
  public categories: string[];

  /**
   * @description дополнительные параметры
   * @type {Record<string, unknown>}
   */
  public params: Record<string, unknown>;

  /**
   * массив подкоманд
   * @property {Command[]} commands
   */
  public commands: Command[];

  constructor(data: ICommand<C, U>) {
    if (!data.pattern) {
      throw new ConfigureError(
        'Не указан pattern команды (регулярное выражение)',
      );
    }

    if (!(data.pattern instanceof RegExp)) {
      data.pattern = new RegExp(data.pattern);
    }

    if (!data.handler) {
      throw new ConfigureError('Не указан обработчик команды');
    }

    if (typeof data.handler !== 'function') {
      throw new ConfigureError('Обработчик команды не является функцией');
    }

    const {
      pattern,
      name,
      description,
      categories,
      params,
      commands,
      handler,
    } = data;

    this.pattern = pattern;
    this.name = name || '';
    this.description = description || '';
    this.categories = categories || [];
    this.params = params || {};
    this.commands = <Command[] | []>commands || [];
    this.handler = handler;
  }

  get [Symbol.toStringTag](): string {
    return 'Command';
  }

  /**
   * @description поиск подкоманд
   * @param {Record<string, unknown>} context
   * @return {Command}
   */
  findSubCommand<ctx extends Context>(context: ctx & IContext): Command<C, U> {
    let command: Command | undefined = this.commands.find(subCommand =>
      (subCommand.pattern as RegExp).test(context.body?.[0] as string),
    );
    // for (const subCommand of this.commands) {
    //   if ((<RegExp>subCommand.pattern).test(context.body[1])) {
    //     command = subCommand;
    //   }
    // }

    if (!command) {
      return this;
    }

    context.body = context.body?.[1].match(
      command.pattern as RegExp,
    ) as RegExpMatchArray;

    if (command.commands.length) {
      command = (<Command>command).findSubCommand<ctx>(context);
    }

    return command as Command<C, U>;
  }
}
