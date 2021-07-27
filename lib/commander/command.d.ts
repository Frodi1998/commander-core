import { IParams, ICommand, IContext, Context } from "../types";
/**
 * @typedef {function} handler
 * @param {Record<string, any>} context контекст из vk-io или puregram
 * @param {Record<string, any>} bot дополнительные параметры переданные в обработчик (params)
 */
/**
 * @description Класс команды
 * @class
 */
export declare class Command {
    /**
     * @property {RegExp | string} pattern паттерн команды
     */
    pattern: RegExp | string;
    /**
     * @property {string} name название команды
     */
    name?: string;
    /**
     * @property {string} description описание команды
     */
    description?: string;
    /**
     * @property {Record<string, any>} params дополнительные параметры команды
     */
    params?: IParams | Record<string, unknown>;
    /**
     * @property {Array<Command>} commands массив подкоманд
     */
    commands: Command[];
    /**
     * @property {handler} handler
     */
    handler: (context: any, bot: any) => void | Promise<void>;
    /**
     * конструктор команды
     * @param data
     * @example
     *
     * new Command({
     *  pattern: /test/i,
     *  description: 'test',
     *
     *  params: {
     *      commandsType: 'test'
     *  },
     *
     *  handler(context) {
     *      return context.send('test');
     *  }
     * })
     */
    constructor(data: ICommand);
    /**
     * @description поиск подкоманд
     * @param {Record<string, any>} context
     * @returns {Command}
     */
    findSubCommand<c extends Context>(context: c & IContext): Command;
}
