import { Command } from "../commander/command";
import { Context, IContext, IHandlerParams } from "../../types";

export async function contextHandler<c extends Context>(context: c & IContext, bot: IHandlerParams): Promise<void> {
    const startTime: number = Date.now();

    const command: Command = bot.commander.find<c>(context);
	
	if(!command) {
		bot.listener.emit('command_not_found', context, bot.params);
		return;
	}

	bot.params.command = command;

	await Promise.all([
		bot.listener.emit('command_job', context, bot.params),
		command.handler(context, bot.params)
	])
	.catch((error) =>{
		bot.listener.emit('command_error', context, bot.params, error);
		return;
	})

	bot.ping = Date.now() - startTime;

	bot.listener.emit('command_ready', context, bot.params);
}