import { EventEmitter } from 'events';

import { Commander } from './commander';
import { contextHandler } from './context/contextHandler';
import { ConfigureError } from './errors';
import { IHandlerParams, IContext, IParams } from './types';
import { Context } from './types';
export * from './commander/command'
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
export class Handler<core extends IParams = null>{
    public commandsDirectory : string;
    
    public listener : EventEmitter = new EventEmitter();

    public commander : Commander = new Commander();

    public params: core & IParams | IParams

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
    constructor(data: IHandlerParams<core>) {
        this.commandsDirectory = data.commandsDirectory;
		this.params = data.params;
        this.params.listener = this.listener;
        this.params.commander = this.commander;
        
        // this.params = new Utils({
        //     listener: this.listener,
        //     commander: this.commander,
        //     default: data.params
        // })
        
        return this
    }

    handler<T extends Context>(context: T): Promise<void> {
		return this.execute<T>(context)
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
	async execute<T extends Context>(context: T & IContext): Promise<void> {
        if(!this.commander.commandsLoaded) {
            await this.commander.loadFromDirectory(this.commandsDirectory)
                .catch(() => new ConfigureError('не удалось загружить команды'))

            this.commander.commandsLoaded = true;
        }

        this.listener.emit('command_begin', context, this.params)
		
		if(!context.command) {
			context.command = context.text
		}
		
		return contextHandler<T>(context, this);
	}
}