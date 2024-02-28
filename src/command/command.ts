import { ConfigureError } from '../errors/index.js';
import type { AnyObject } from '../types.js';
import type {
  CommandContextLayer,
  CommandPayloadLayer,
  ICommand,
  THandlerCommand,
} from './types.js';

/**
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
export class Command<
  C extends AnyObject = AnyObject,
  U extends AnyObject = AnyObject,
  R = CommandPayloadLayer<U>,
> {
  /**
   * паттерн команды
   */
  public pattern: RegExp | string;

  /**
   * обработчик комманды
   */
  public handler: THandlerCommand<C, R>;

  /**
   * название
   */
  public name: string;

  /**
   * @description описание
   * @property {string} description
   */
  public description: string;

  /**
   * категория команды, опционально
   */
  public categories: string[];

  /**
   * дополнительные параметры
   */
  public params: Record<string, unknown>;

  /**
   * массив подкоманд
   */
  public commands: Command<C, U, R>[];

  constructor(data: ICommand<C, U, R>) {
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
    this.commands = <Command<C, U, R>[] | []>commands || [];
    this.handler = handler;
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }

  /**
   * @description поиск подкоманд
   * @param {Record<string, unknown>} context
   * @return {Command}
   */
  findSubCommand<ctx extends AnyObject>(
    context: CommandContextLayer<ctx>,
  ): Command<C, U, R> {
    let command = this.commands.find(subCommand =>
      (subCommand.pattern as RegExp).test(context.body?.[1] as string),
    );

    if (!command) {
      return this;
    }

    context.body = context.body?.[1].match(
      command.pattern as RegExp,
    ) as RegExpMatchArray;

    if (command.commands.length) {
      command = (<Command<C, U, R>>command).findSubCommand<ctx>(context);
    }

    return command as Command<C, U, R>;
  }
}
