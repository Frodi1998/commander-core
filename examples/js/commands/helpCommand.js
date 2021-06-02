const { Command } = require('commander-core');

module.exports = new Command({
	pattern: /^(пом[ао]щь|help)$/i,
	name: 'помощь',
	description: 'список команд бота',
    
    params: {
        commandType: 'помощь'
    },

	async handler(context, bot) {
		const commands = bot.commander.commands
            .filter(command => command.name);

        const tab = '&#12288;';

        let message = 'Список команд бота:\n\n';
        let tabs;

        function findSubCommands(command, tabs) {
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

        context.send(message);
    }
})