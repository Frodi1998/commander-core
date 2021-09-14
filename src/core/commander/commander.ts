import path = require('path');
import { promisify } from 'util';
import glob = require('glob');
import { existsSync } from 'fs';
import debug from 'debug';

import { Command } from './command';
import { ConfigureError } from '../errors';
import { Context, IContext } from '../../types';

const findFiles = promisify(glob);
const logger = debug('commander-core:commander');

function existDirectory(dir: string): boolean {
    return existsSync(dir)
}

/**
 * @description класс обработки
 * @class 
 */
export class Commander {
  private commands : Command[] = [];
	
	public commandsLoaded = false;

	get [Symbol.toStringTag](): string {
		return 'Commander';
	}

	/**
	 * @description выводит команды
	 */
	get getCommands(): Command[] {
		return this.commands
	}

	/**
	 * @description загрузка команд из директории
	 * @param {string} dir директория загрузки команд
	 * @returns {Promise<void>}
	 */
    async loadFromDirectory(dir: string): Promise<void> {
		try {
			if(!existDirectory(dir)) {
        logger('Commandsdirectory not found');
				throw new ConfigureError(`${dir} не существует`);
			}

			const absPath = path.resolve(dir);
			const filePaths = await findFiles(`${absPath}/**/*.js`);

      logger('Commandsdirectory files %O', filePaths);

			await filePaths.forEach(async(filePath) => {
				let file = await import(filePath);
				file = file.default? file.default: file;
        logger('fileName: %s, fileContent: %o', filePath, file);

				if(!Array.isArray(file)) {
					file = [file]
				}

				if(file.length === 0) {
					return;
				}

				file.forEach((command) => {
					if(!(command instanceof Command)) {
            logger('Command not instance Command');
						throw new ConfigureError(`Экспартируемые данные в файле ${filePath} не являются командой`);
					}

					this.addCommands(command);
				})
			})

			this.commandsLoaded = true;
		} catch(err) {
      console.error(err);
			this.commandsLoaded = false;
		}
    }

	/**
	 * @description добавляет новые команды
	 * @param command 
	 */
	addCommands(commands: Command | Command[]): number {
		if(!Array.isArray(commands)) {
      logger('add new command');
			return this.commands.push(commands);
		}
		
    logger('add new commands');
		commands.forEach(command => this.commands.push(command));
		
		return this.commands.length;
	}

	/**
	 * @description устанавливает команды удаляя старые
	 * @param commands 
	 */
	setCommands(commands: Command[]): void {
    logger('set new commands');
		this.commands = commands
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
    async find<c extends Context>(context: c & IContext): Promise<Command> {
		let command: Command;

		for await(const com of this.commands) {
			if((<RegExp>com.pattern).test(context.$command)) {
        logger('command found');
				command = com;
				break;
			}
		}

		if(!command) {
			return null;
		}

		context.body = context.$command.match(command.pattern)

		if((<Command[]>command.commands).length) {
      logger('find subсommand');
      command = command.findSubCommand<c>(context);
		}

		return command;
    }
}