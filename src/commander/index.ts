import path = require('path');
import { promisify } from 'util';
import glob = require('glob');
import { existsSync } from 'fs';

import { Command } from './command';
import { ConfigureError } from '../errors';
import { Context, IContext } from '../types';

const findFiles = promisify(glob);

function existDirectory(dir: string): boolean {
    return existsSync(dir)
}

/**
 * @description класс обработки
 * @class 
 */
export class Commander {
	/**
	 * @property {Array<Command>} commands массив команд
	 */
    public commands : Command[] = [];
	
	public commandsLoaded = false;

    constructor() {
        return this
    }

	/**
	 * @description загрузка команд
	 * @param {string} dir директория загрузки команд
	 * @returns {Promise<void>}
	 */
    async loadFromDirectory(dir: string): Promise<void> {
		try {
			if(!existDirectory(dir)) {
				throw new ConfigureError(`${dir} не существует`);
			}

			const absPath = path.resolve(dir);
			const filePaths = await findFiles(`${absPath}/**/*.js`);

			filePaths.forEach(async(filePath) => {
				let file = await import(filePath);
				file = file.default? file.default: file;

				if(!Array.isArray(file)) {
					file = [file]
				}

				if(file.length === 0) {
					return;
				}

				for(const com of file) {
					if(!(com instanceof Command)) {
						throw new ConfigureError(`Экспартируемые данные в файле ${filePath} не являются командой`);
					}
					
					this.commands.push(com);
				}
			})

			// for(const filePath of filePaths) {
			// 	let file = await import(filePath);
			// 	// let file = require(filePath);
			// 	file = file.default? file.default: file;

			// 	if(!Array.isArray(file)) {
			// 		file = [file]
			// 	}

			// 	if(file.length === 0) {
			// 		continue;
			// 	}

			// 	for(const com of file) {
			// 		if(!(com instanceof Command)) {
			// 			throw new ConfigureError(`Экспартируемые данные в файле ${filePath} не являются командой`);
			// 		}
					
			// 		this.commands.push(com);
			// 	}
			// }
		}
        
		catch(err) {
			this.commandsLoaded = false;
		}
    }

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
    find<c extends Context = Context & IContext>(context: c & IContext): Command {
		let command: Command;

		for(const com of this.commands) {
			if((<RegExp>com.pattern).test(context.command)) {
				command = com;
				break;
			}
		}

		if(!command) {
			return null;
		}

		context.body = context.command.match(command.pattern)

		if((<Command[]>command.commands).length) {
            command = command.findSubCommand<c>(context);
		}

		return command;
    }
}