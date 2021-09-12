// import { EventEmitter } from 'events';

// import { Commander } from './core/commander';
// import { contextHandler } from './core/context/contextHandler';
// import { ConfigureError } from './core/errors';
// import { IHandlerParams, IContext, IParams } from './types';
// import { Context } from './types';
// export * from './core/commander/command'
// export * from "./types";

// /**
//  * @typedef {object} eventEmiter
//  * @property {function} emit создает новое событие
//  * @property {function} on слушатель событий
//  * @example
//  * 
//  * listener.emit('test', args1, args2 ...args)
//  * listener.on('test', (args1, args2) => {
//  * //code
//  * })
//  */

//  /**
//  * 
//  * @typedef {object} HandlerParams
//  * @property {string} commandsDirectory директория команд
//  * @property {object} params функции и константы
//  */

// /**
//  * @description класс обработчика
//  * @class
//  */
// export class Handler<core extends IParams = null>{
//     public commandsDirectory : string;
    
//     public listener : EventEmitter = new EventEmitter();

//     public commander : Commander = new Commander();

//     public params: core & IParams | IParams

//     /**
//      * 
//      * @typedef {object} handler
//      * @property {string} commandsDirectory директория команд
//      * @property {object} params функции и константы доступны в команде через объект bot
//      * @property {listener} eventEmiter обработчик событий
//      * @property {commander} commander обработчик команд
//      */

//     /**
//      * @description конструктор
//      * @param {HandlerParams} data данные обработчика
//      * @returns {handler}
//      * @example js
//      * 
//      * const params = {
//      *  testMetods() {
//      *      console.log('test')
//      *  }
//      * }
//      * 
//      * const handler = new Handler({
//      *  commandsDirectory: path.resolve + '/commands',
//      *  params: params
//      * })
//      * 
//      * @example ts
//      * 
//      * import { IParams, Handler } from "commander-core";
//      * 
//      * class Params implements IParams {
//      *  testMetods() {
//      *      console.log('test')
//      *  }
//      * }
//      * 
//      * const handler = new Handler<Params>({
//      *  commandsDirectory: path.resolve + '/commands',
//      *  params: new Params();
//      * })
//      */
//     constructor(data: IHandlerParams<core>) {
//         if(!data.commandsDirectory) {
//             throw new ConfigureError('не указана директория команд');
//         }

//         if(!data.params) {
//             throw new ConfigureError('не указаны параметры');
//         }

//         this.commandsDirectory = data.commandsDirectory;
// 		this.params = data.params;
//         this.params.listener = this.listener;
//         this.params.commander = this.commander;
        
//         return this
//     }

//     /**
//      * @description загружает команды из директории
//      * @returns {Promise<void>}
//      */
//     loadCommands(): Promise<void> {
//         return this.commander.loadFromDirectory(this.commandsDirectory)
//     }

//     handler<T extends Context>(context: T): Promise<void> {
// 		return this.execute<T>(context)
// 	}

//     /**
//      * @description обработка команды
//      * @param {object} context объект контекста возвращаемый из vk-io или puregram
//      * @returns {void}
//      * @example
//      * 
//      * execute<MessageContext>(context)
//      * // => void
//      */
// 	async execute<T extends Context>(context: T & IContext): Promise<void> {
//         if(!this.commander.commandsLoaded) {
//             try {
//                 await this.commander.loadFromDirectory(this.commandsDirectory)
//             } catch(err) {
//                 throw new ConfigureError('не удалось загружить команды')
//             }
//         }

//         this.listener.emit('command_begin', context, this.params)
		
// 		if(!context.command) {
// 			context.command = context.text
// 		}
		
// 		return contextHandler<T>(context, this);
// 	}
// }