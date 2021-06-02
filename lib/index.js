"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const events_1 = require("events");
const commander_1 = require("./commander");
// import { Listener } from './modules/listener';
const contextHandler_1 = require("./context/contextHandler");
const errors_1 = require("./errors");
__exportStar(require("./commander/command"), exports);
__exportStar(require("./types"), exports);
// class Utils implements IParams {
//     public listener: EventEmitter = null;
//     public commander: Commander = null
//     public ping: number = null;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     [key: string]: any;
//     constructor(params: IParams) {
//         this.listener = params.listener;
//         this.commander = params.commander;
//         for(const [key, value] of Object.entries(params.default)) {
//             this[key] = value;
//         }
//     }
// }
/**
 * @typedef {object} eventEmiter
 * @property {function} emit создает новое событие
 * @property {function} on слушатель событий
 * @example
 *
 * listener.emit('test', args1, args2 ...args)
 * listener.on('test', (args1, args2) => {
 * //code
 * })
 */
/**
*
* @typedef {object} HandlerParams
* @property {string} commandsDirectory директория команд
* @property {object} params функции и константы
*/
/**
 * @description класс обработчика
 * @class
 */
class Handler {
    /**
     *
     * @typedef {object} handler
     * @property {string} commandsDirectory директория команд
     * @property {object} params функции и константы доступны в команде через объект bot
     * @property {listener} eventEmiter обработчик событий
     * @property {commander} commander обработчик команд
     */
    /**
     * @description конструктор
     * @param {HandlerParams} data данные обработчика
     * @returns {handler}
     * @example js
     *
     * const params = {
     *  testMetods() {
     *      console.log('test')
     *  }
     * }
     *
     * const handler = new Handler({
     *  commandsDirectory: path.resolve + '/commands',
     *  params: params
     * })
     *
     * @example ts
     *
     * import { IParams, Handler } from "commander-core";
     *
     * class Params implements IParams {
     *  testMetods() {
     *      console.log('test')
     *  }
     * }
     *
     * const handler = new Handler<Params>({
     *  commandsDirectory: path.resolve + '/commands',
     *  params: new Params();
     * })
     */
    constructor(data) {
        this.listener = new events_1.EventEmitter();
        this.commander = new commander_1.Commander();
        this.commandsDirectory = data.commandsDirectory;
        this.params = data.params;
        this.params.listener = this.listener;
        this.params.commander = this.commander;
        // this.params = new Utils({
        //     listener: this.listener,
        //     commander: this.commander,
        //     default: data.params
        // })
        return this;
    }
    handler(context) {
        return this.execute(context);
    }
    /**
     * @description обработка команды
     * @param {object} context объект контекста возвращаемый из vk-io или puregram
     * @returns {void}
     * @example
     *
     * execute<MessageContext>(context)
     * // => void
     */
    async execute(context) {
        if (!this.commander.commandsLoaded) {
            await this.commander.loadFromDirectory(this.commandsDirectory)
                .catch(() => new errors_1.ConfigureError('не удалось загружить команды'));
            this.commander.commandsLoaded = true;
        }
        this.listener.emit('command_begin', context, this.params);
        if (!context.command) {
            context.command = context.text;
        }
        return contextHandler_1.contextHandler(context, this);
    }
}
exports.Handler = Handler;
