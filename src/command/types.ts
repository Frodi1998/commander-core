import type { AnyObject, MaybePromise } from '../types.js';
import type { IUtils } from '../util/utils-core.js';
import type { Command } from './command.js';

export interface CommandContext {
  $command?: string;
  body?: RegExpMatchArray;
}

export type CommandContextLayer<T = AnyObject> = T & CommandContext;

export type CommandPayloadLayer<T extends AnyObject = AnyObject> =
  T extends IUtils ? T : T & IUtils;

/**
 * @deprecated use CommandContextLayer<Context>
 */
export interface Context extends CommandContextLayer {
  text?: string;
}

/**
 * @deprecated use CommandContext
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IContext extends CommandContext {}

/**
 * @typedef {Function}
 * @example
 *
 * handler(context, utils) {
 *  bot.testMetod() //utils.testMetod
 *  context.send('ура')
 * }
 */
export type CommandHandler<C = AnyObject, U = IUtils> = (
  context: CommandContextLayer<C>,
  utils: U,
) => MaybePromise<unknown>;

/**
 * @deprecated use CommandHandler
 */
export type THandlerCommand<C = AnyObject, U = IUtils> = CommandHandler<C, U>;

/**
 * @interface
 */
export interface ICommand<
  C extends AnyObject = AnyObject,
  U extends AnyObject = AnyObject,
  R = CommandPayloadLayer<U>,
> {
  /**
   * @type {RegExp | string} регулярное выражение
   */
  pattern: RegExp | string;

  /**
   * @type {THandlerCommand} функция обработки
   */
  handler: CommandHandler<C, R>;

  /**
   * @type {string} название команды
   */
  name?: string;

  /**
   * @type {string} краткое описание команды
   * @default ''
   */
  description?: string;

  /**
   * @type {string[]} категории команды
   * @default []
   */
  categories?: string[];

  /**
   * @type {Record<string, unknown>} дополнительные параметры
   * @default {}
   */
  params?: Record<string, unknown>;

  /**
   * @type {Command[]} массив подкоманд
   * @default []
   */
  commands?: Command<C, U, R>[];
}
