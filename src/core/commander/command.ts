import { ConfigureError } from "../errors";
import { ICommand, IContext, Context, THandlerCommand } from "../../types";

/**
 * @description Класс команды
 * @class
 */
export class Command {
    /**
     * @type {RegExp | string} паттерн команды
     */
    public pattern: RegExp | string;

    /**
     * @type {string} название команды
     */
    public name?: string;

    /**
     * @type {string} короткое описание команды
     */
    public description?: string;

    /**
     * @type {Array<string>}
     */
    public categories: string[];

    /**
     * @type {Array<Command>} массив подкоманд
     */
    public commands: Command[];

    /**
     * @type {THandlerCommand} обработчик команды
     */
    handler: THandlerCommand;

    [key: string]: unknown;
    
    /**
     * конструктор команды
     * @param {ICommand} data 
     * @example
     * 
     * new Command({
     *  pattern: /test/i,
     *  name: 'test',
     *  description: 'test command',
     *  
     *  handler(context) {
     *      context.send('test');
     *  }
     * })
     */
    constructor(data: ICommand) {
        if(!data.pattern) {
			throw new ConfigureError('Не указан pattern команды (регулярное выражение)');
        }

        if(!(data.pattern instanceof RegExp)) {
			data.pattern = new RegExp(data.pattern);
		}

        if(!data.handler) {
			throw new ConfigureError('Не указан обработчик команды');
		}

		if(typeof data.handler !== 'function') {
			throw new ConfigureError('Обработчик команды не является функцией');
        }

        const { 
            pattern, 
            name, 
            description,  
            commands, 
            handler 
        } = data;
        
        this.pattern = pattern;
		this.name = name;
		this.description = description || '';
		this.commands = <Command[] | []>commands || [];
        this.handler = handler;
    }

    get [Symbol.toStringTag](): string {
		return 'Command';
	}

    /**
     * @description поиск подкоманд
     * @param {Record<string, any>} context 
     * @returns {Command}
     */
    findSubCommand<c extends Context>(context: c & IContext): Command {
        let command: Command;

        for(const subCommand of this.commands) {            
            if ((<RegExp>subCommand.pattern).test(context.body[1])) {
                command = subCommand;
            }
        }

        if(!command) {
            return this;
        }

        context.body = context.body[1].match(command.pattern);

        if(command.commands.length) {
            command = (<Command>command).findSubCommand<c>(context);
        }      

        return command;
	}
}