import { Command } from './command';
import { Context, IContext } from '../types';
/**
 * @description класс обработки
 * @class
 */
export declare class Commander {
    /**
     * @property {Array<Command>} commands массив команд
     */
    commands: Command[];
    commandsLoaded: boolean;
    constructor();
    /**
     * @description загрузка команд
     * @param {string} dir директория загрузки команд
     * @returns {Promise<void>}
     */
    loadFromDirectory(dir: string): Promise<void>;
    /**
     * @description поиск команды
     * @param {any} context
     * @returns {Command}
     * @example ts
     *
     * import { MessageContext } from "vk-io";
     *
     * const command = commander.find<MessageContext>(context)
     */
    find<c extends Context = Context & IContext>(context: c & IContext): Command;
}
