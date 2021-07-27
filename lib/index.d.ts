/// <reference types="node" />
import { EventEmitter } from 'events';
import { Commander } from './commander';
import { IHandlerParams, IContext, IParams } from './types';
import { Context } from './types';
export * from './commander/command';
export * from "./types";
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
export declare class Handler<core extends IParams = null> {
    commandsDirectory: string;
    listener: EventEmitter;
    commander: Commander;
    params: core & IParams | IParams;
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
    constructor(data: IHandlerParams<core>);
    handler<T extends Context>(context: T): Promise<void>;
    /**
     * @description обработка команды
     * @param {object} context объект контекста возвращаемый из vk-io или puregram
     * @returns {void}
     * @example
     *
     * execute<MessageContext>(context)
     * // => void
     */
    execute<T extends Context>(context: T & IContext): Promise<void>;
}
