//@ts-ignore
import { Command, IContext, IParams } from 'commander-core';
//@ts-ignore
import { MessageContext } from 'vk-io';
import Utils from "../utils";

interface AdapterUtils extends Utils, IParams {};
interface AdapterContext extends MessageContext, IContext {};

export default new Command({
	pattern: /^(пом[ао]щь|help)$/i,
	name: 'помощь',
	description: 'список команд бота',
    
    params: {
        commandType: 'помощь'
    },

	async handler(context: AdapterContext, bot: AdapterUtils) {
        //@ts-ignore
		const commands: Command[] = bot.commander.getCommands
            .filter((command: Command) => command.name);

        const tab = '&#12288;';

        let message = 'Список команд бота:\n\n';
        let tabs: number;

        function findSubCommands(command: Command, tabs: number): Command {
            const subCommands = command.commands
                .filter(command => command.name);

            if (!subCommands.length) {
                return;
            }

            for (const subCommand of command.commands) {
                message += `${tab.repeat(tabs)} ${subCommand.name} -- ${subCommand.description}\n`;

                if (subCommand.commands.length) {
                    findSubCommands(subCommand, tabs += 1);
                }
            }
        }

        for (const command of commands) {
            tabs = 1;
            message += `${command.name} -- ${command.description}\n`;

            if (command.commands.length) {
                findSubCommands(command, tabs);
            }
        }

        //@ts-ignore
        context.send(message);
    }
})