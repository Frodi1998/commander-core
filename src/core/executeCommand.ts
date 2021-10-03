import debug from 'debug';

import { Command } from "./commander/command";
import { Context, IContext } from "../types";
import { UtilsCore } from './utils';

const logger = debug('commander-core:handler');

export default async function executeCommand<ctx extends Context>(context: ctx & IContext, utils: UtilsCore): Promise<void> {
	logger('start command processing');
	logger('execute param context: %O', context);
	logger('execute param utils: %O', utils);

  utils.events.emit('command_begin', {context, utils});
    
  if(!context.$command) {
    context.$command = context.text
  }

  const startTime = Date.now();
  const command: Command = await utils.commander.find<ctx>(context);
	
	if(!command) {
		logger('command not found');

		utils.events.emit('command_not_found', {context, utils});
		return;
	}

	utils.setCommand(command);

	if(utils.getCommandStatus === 'default') {
		await utils.events.emit('command_job', {context, utils});
	}

	if(utils.getCommandStatus === 'stop') {
		logger('stop execute');
		return;
	}

	if(utils.getCommandStatus === 'default') {
		try {
			await command.handler(context, utils)
		} catch(error) {
			utils.events.emit('command_error', {context, utils, error});
			return;
		}
	}

	// await Promise.all([
	// 	utils.events.emit('command_job', {context, utils}),
	// 	command.handler(context, utils)
	// ])
	// .catch((error) =>{
	// 	utils.events.emit('command_error', {context, utils, error});
	// 	return;
	// })

	utils.setPing(startTime);

	utils.events.emit('command_ready', {context, utils});
	logger('command executed');
}