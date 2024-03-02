// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export type UnknownObj = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructable<T> = new (...args: any[]) => T;

export type AssertExtendedType<T, T1> = T extends T1 ? T1 : T & T1;

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
   * Синхронно вызывает каждого из прослушивателей, зарегистрированных для указанного события ```eventName```,
   * в том порядке, в котором они были зарегистрированы, передавая каждому предоставленные аргументы.
   * @type {TEmit}
   */
  emit: TEmit;

  /**
   * Добавляет ```listener``` функцию в конец массива слушателей для названного события eventName.
   * @type {TOn}
   */
  on: TOn;

  /**
   * Возвращает массив со списком событий, для которых эмиттер зарегистрировал слушателей.
   * Значения в массиве - это строки или ```Symbols```.
   * @type {TEventNames}
   */
  eventNames: TEventNames;
}
