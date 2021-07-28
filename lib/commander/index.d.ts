import { Command } from './command';
import { Context, IContext } from '../types';
/**
 * @description класс обработки
 * @class
 */
export declare class Commander {
    private commands;
    commandsLoaded: boolean;
    constructor();
    /**
     * @description выводит команды
     */
    get getCommands(): Command[];
    /**
     * @description загрузка команд из директории
     * @param {string} dir директория загрузки команд
     * @returns {Promise<void>}
     */
    loadFromDirectory(dir: string): Promise<void>;
    /**
     * @description добавляет новые команды
     * @param command
     */
    addCommand(command: Command): void;
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
