"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const errors_1 = require("../errors");
/**
 * @typedef {function} handler
 * @param {Record<string, any>} context контекст из vk-io или puregram
 * @param {Record<string, any>} bot дополнительные параметры переданные в обработчик (params)
 */
/**
 * @description Класс команды
 * @class
 */
class Command {
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
    constructor(data) {
        /**
         * @property {string} description описание команды
         */
        this.description = '';
        /**
         * @property {Array<Command>} commands массив подкоманд
         */
        this.commands = [];
        if (!data.pattern) {
            throw new errors_1.ConfigureError('Не указан pattern команды (регулярное выражение)');
        }
        if (!(data.pattern instanceof RegExp)) {
            data.pattern = new RegExp(data.pattern);
        }
        if (!data.handler) {
            throw new errors_1.ConfigureError('Не указан обработчик команды');
        }
        if (typeof data.handler !== 'function') {
            throw new errors_1.ConfigureError('Обработчик команды не является функцией');
        }
        const { pattern, name, description, params, commands, handler } = data;
        this.pattern = pattern;
        this.name = name;
        this.description = description || '';
        this.commands = commands || [];
        this.params = params || {};
        this.handler = handler;
    }
    /**
     * @description поиск подкоманд
     * @param {Record<string, any>} context
     * @returns {Command}
     */
    findSubCommand(context) {
        let command;
        for (const subCommand of this.commands) {
            if (subCommand.pattern.test(context.body[1])) {
                command = subCommand;
            }
        }
        if (!command) {
            return this;
        }
        context.body = context.body[1].match(command.pattern);
        if (command.commands.length) {
            command = command.findSubCommand(context);
        }
        return command;
    }
}
exports.Command = Command;
