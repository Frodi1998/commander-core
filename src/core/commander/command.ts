import { ConfigureError } from "../errors";
import { ICommand, IContext, Context } from "../../types";

/**
 * @description Класс команды
 * @class
 */
export class Command {
    /**
     * @property {RegExp | string} pattern паттерн команды
     */
    public pattern: RegExp | string;

    /**
     * @property {string} name название команды
     */
    public name?: string;

    /**
     * @property {string} description описание команды
     */
    public description?: string = '';

    /**
     * @property {Array<Command>} commands массив подкоманд 
     */
    public commands: Command[] = [];

    /**
     * @property {handler} handler
     */
    // eslint-disable-next-line
    handler: (context: any, bot: any) => void | Promise<void>;

    [key: string]: unknown;
    
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