import { Command, UtilsCore } from '../main.js';

export type AnyObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface Context extends AnyObject {
  text?: string;
}

export interface IContext {
  $command?: string;
  body?: RegExpMatchArray;
}

/**
 * @typedef {Function}
 * @example
 *
 * handler(context, bot) {
 *  bot.testMetod() //utils.testMetod
 *  context.send('ура')
 * }
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type THandlerCommand = (
  context: AnyObject,
  bot: UtilsCore,
) => unknown | Promise<unknown>;

/**
 * @interface
 */
export interface ICommand {
  /**
   * @type {RegExp | string} регулярное выражение
   */
  pattern: RegExp | string;

  /**
   * @type {THandlerCommand} функция обработки
   */
  handler: THandlerCommand;

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
  commands?: Command[];
}

/**
 * @typedef {Function}
 */
// eslint-disable-next-line
type TEmit = (eventName: string | symbol, ...args: any) => boolean;

/**
 * @typedef {Function}
 */
type TOn = (
  eventName: string | symbol,
  // eslint-disable-next-line
  listener: (...args: any) => any,
) => EventEmitter;

/**
 * @typedef {Function}
 */
type TEventNames = () => Array<string>;

/**
 * @interface
 */
export interface EventEmitter {
  /**
   * @description
   * Синхронно вызывает каждого из прослушивателей, зарегистрированных для указанного события ```eventName```,
   * в том порядке, в котором они были зарегистрированы, передавая каждому предоставленные аргументы.
   * @type {TEmit}
   */
  emit: TEmit;

  /**
   * @description Добавляет ```listener``` функцию в конец массива слушателей для названного события eventName.
   * @type {TOn}
   */
  on: TOn;

  /**
   * @description
   * Возвращает массив со списком событий, для которых эмиттер зарегистрировал слушателей.
   * Значения в массиве - это строки или ```Symbols```.
   * @type {TEventNames}
   */
  eventNames: TEventNames;
}
