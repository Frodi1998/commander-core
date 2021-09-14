import debug from 'debug';

import { Command } from "./commander/command";
import { Context, IContext } from "../types";
import { UtilsCore } from './utils';

const logger = debug('commander-core:handler');

export default async function executeCommand<ctx extends Context>(context: ctx & IContext, bot: UtilsCore): Promise<void> {
    const startTime: number = Date.now();

    const command: Command = await bot.commander.find<ctx>(context);
	
	if(!command) {
		logger('command not found');

		bot.events.emit('command_not_found', context, bot);
		return;
	}

	bot.setCommand(command);

	await Promise.all([
		bot.events.emit('command_job', context, bot),
		command.handler(context, bot)
	])
	.catch((error) =>{
		bot.events.emit('command_error', context, bot, error);
		return;
	})

	bot.setPing(startTime);

	bot.events.emit('command_ready', context, bot);
	logger('command executed');
}