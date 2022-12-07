import path from 'path';
import { existsSync } from 'fs';
import debug from 'debug';
import walkSync from 'walk-sync';

import { Command } from './command.js';
import { ConfigureError } from '../errors/index.js';
import { Context, IContext } from '../../types/index.js';

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
  async loadFromDirectory(dir: string): Promise<boolean> {
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
        await this.importCommandFromFile(filePath);
      }

      return (this.commandsLoaded = true);
    } catch (err) {
      console.error(err);
      return (this.commandsLoaded = false);
    }
  }

  /**
   * @description добавляет новые команды
   * @param {Command | Command[]} commands
   * @return {number}
   */
  async addCommands(commands: Command | Command[]): Promise<number> {
    commands = !Array.isArray(commands) ? [commands] : commands;

    for await (const command of commands) {
      logger('add new command');
      this.commands.push(command);
    }

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
  async find<C extends Context & IContext>(
    context: C,
  ): Promise<Command | undefined> {
    let command = this.commands.find(cmd =>
      (cmd.pattern as RegExp).test(context.$command as string),
    );

    if (command) {
      context.body = context.$command?.match(
        command.pattern as string,
      ) as RegExpMatchArray;

      if (command.commands.length) {
        logger('find subсommand');
        command = command.findSubCommand<C>(context);
      }
    }

    return command;
  }

  private async importCommandFromFile(filePath: string): Promise<void> {
    // const file = await import(filePath);
    const file = await this.loadFile(filePath);

    if (!file) {
      return;
    }
    // let commands = file.default ? file.default : file;
    logger('fileName: %s', filePath);
    logger('fileContent: %O', file);
    const commands = !Array.isArray(file) ? [file] : file;
    // if (!Array.isArray(file)) {
    //   file = [file];
    // }

    for await (const command of commands) {
      if (!(command instanceof Command)) {
        logger('Command not instance Command');
        throw new ConfigureError(
          `Экспартируемые данные в файле ${filePath} не являются командой`,
        );
      }

      const isCommands = commands.every(command => command instanceof Command);
      if (!isCommands) {
        logger('Command not instance Command');
        throw new ConfigureError(
          `Экспартируемые данные в файле ${filePath} не являются командой`,
        );
      }

      await this.addCommands(commands);
    }
  }

  private async loadFile(filePath: string) {
    let file;
    try {
      file = await import(`file:///${filePath}`);
    } catch (error) {
      file = await import(filePath);
    }

    return file.default ? file.default : file;
  }
}
