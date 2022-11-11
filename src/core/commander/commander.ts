import path = require('path');
import { existsSync } from 'fs';
import debug from 'debug';
import walkSync from 'walk-sync';

import { Command } from './command';
import { ConfigureError } from '../errors';
import { Context, IContext } from '../../types';

const logger = debug('commander-core:commander');

/**
 * @description класс обработки
 * @class
 */
export class Commander {
  public commandsLoaded = false;

  private commands: Command[] = [];

  get [Symbol.toStringTag](): string {
    return 'Commander';
  }

  /**
   * @description выводит команды
   */
  get getCommands(): Command[] {
    return this.commands;
  }

  /**
   * @description загрузка команд из директории
   * @param {string} dir директория загрузки команд
   * @return {Promise<void>}
   */
  async loadFromDirectory(dir: string): Promise<void> {
    try {
      if (!existsSync(dir)) {
        logger('Commandsdirectory not found');
        throw new ConfigureError(`${dir} не существует`);
      }

      const absPath = path.resolve(dir);
      const filePaths = walkSync(absPath, {
        includeBasePath: true,
        globs: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts'],
        ignore: ['**/*ignore*', 'ignore/', '**/*.d.ts'],
      });

      logger('Commandsdirectory files %O', filePaths);

      for await (const filePath of filePaths) {
        this.importCommandFromFile(filePath);
      }

      this.commandsLoaded = true;
    } catch (err) {
      console.error(err);
      this.commandsLoaded = false;
    }
  }

  async importCommandFromFile(filePath: string): Promise<void> {
    const file = await import(filePath);
    let commands = file.default ? file.default : file;
    logger('fileName: %s', filePath);
    logger('fileContent: %O', file);

    if (!Array.isArray(commands)) {
      commands = [commands];
    }

    if (file.length === 0) {
      return;
    }

    for await (const command of commands) {
      if (!(command instanceof Command)) {
        logger('Command not instance Command');
        throw new ConfigureError(
          `Экспартируемые данные в файле ${filePath} не являются командой`,
        );
      }

      this.addCommands(command);
    }
  }

  /**
   * @description добавляет новые команды
   * @param {Command | Command[]} commands
   * @return {number}
   */
  addCommands(commands: Command | Command[]): number {
    if (!Array.isArray(commands)) {
      logger('add new command');
      return this.commands.push(commands);
    }

    logger('add new commands');
    commands.forEach(command => this.commands.push(command));

    return this.commands.length;
  }

  /**
   * @description устанавливает команды удаляя старые
   * @param {Command[]} commands
   * @return {void}
   */
  setCommands(commands: Command[]): void {
    logger('set new commands');
    this.commands = commands;
  }

  /**
   * @description поиск команды
   * @param {IContext} context
   * @return {Promise<Command>}
   * @example ts
   *
   * import { MessageContext } from "vk-io";
   *
   * const command = commander.find<MessageContext>(context)
   */
  async find<c extends Context>(context: c & IContext): Promise<Command> {
    let command: Command;

    for await (const com of this.commands) {
      if ((<RegExp>com.pattern).test(context.$command)) {
        logger('command found');
        command = com;
        break;
      }
    }

    if (!command) {
      return null;
    }

    context.body = context.$command.match(command.pattern);

    if ((<Command[]>command.commands).length) {
      logger('find subсommand');
      command = command.findSubCommand<c>(context);
    }

    return command;
  }
}
