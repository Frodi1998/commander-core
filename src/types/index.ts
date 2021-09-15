export abstract class Context {
  public text: string;
}

export interface IContext {
  $command?: string;
  body?: RegExpMatchArray;
}

export interface ICommand {
  pattern: RegExp | string;
  name?: string;
  description?: string;
  params?: Record<string, unknown>;
  commands?: ICommand[] | [];
  // eslint-disable-next-line
  handler: (context: any, bot: any) => void | Promise<void>;
}

/**
 * @typedef {Function}
 */
type TEmit = (eventName: string | symbol, ...args: any) => boolean;

/**
 * @typedef {Function}
 */
type TOn = (eventName: string | symbol, listener: (...args: any) => any) => IEventEmitter

/**
 * @typedef {Function}
 */
type TEventNames = () => Array<string>

/**
 * @interface
 */
export interface IEventEmitter {
  /**
   * @description Синхронно вызывает каждого из прослушивателей, зарегистрированных для указанного события ```eventName```, в том порядке, 
   * в котором они были зарегистрированы, передавая каждому предоставленные аргументы.
   * Возвращает ```true```, если у события есть слушатели, в противном случае ```false```.
   * @type {TEmit}
   */
  emit: TEmit;

  /**
   * @description Добавляет ```listener``` функцию в конец массива слушателей для названного события eventName.
   * Никаких проверок, чтобы увидеть, был ли ```listener``` уже добавлен, не делается .
   * Несколько вызовов, передающих одну eventName и ту же комбинацию и ```listener```, приведут к listenerдобавлению и вызову несколько раз.
   * @type {TOn}
   */
  on: TOn;

  /**
   * @description Возвращает массив со списком событий, для которых эмиттер зарегистрировал слушателей. Значения в массиве - это строки или ```Symbols```.
   * @type {TEventNames}
   */
  eventNames: TEventNames
}