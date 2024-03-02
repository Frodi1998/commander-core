import debug from 'debug';

import { CommandContextLayer, CommandPayloadLayer } from '../command/index.js';
import { ListenerContext } from './index.js';
import { AnyObject } from '../types.js';

const logger = debug('commander-core:handler');

export default async function executeCommand<
  C extends AnyObject = AnyObject,
  U extends AnyObject = AnyObject,
  CTX extends CommandContextLayer = CommandContextLayer<C & { text: string }>,
>(context: CTX, utils: CommandPayloadLayer<U>): Promise<void> {
  logger('start command processing');
  logger('execute param context: %O', context);
  logger('execute param utils: %O', utils);

  utils.setCommandStatus('default');
  utils.events.emit('command_begin', { context, utils });

  if (!context.$command) {
    context.$command = context.text;
  }

  const startTime = Date.now();
  const command = await utils.commander.find<CTX>(context);

  if (!command) {
    logger('command not found');

    utils.events.emit('command_not_found', { context, utils });
    return;
  }

  utils.setCommand(command);

  if (utils.getCommandStatus === 'default') {
    await utils.events.emit('command_job', { context, utils });
  }

  if (utils.getCommandStatus === 'stop') {
    logger('stop execute');
    return;
  }

  if (utils.getCommandStatus === 'default') {
    try {
      await command.handler(context, utils);
    } catch (error) {
      const params: ListenerContext<CTX, U> = {
        context,
        utils,
        error: error as Error,
      };

      utils.events.emit('command_error', params);
      return;
    }
  }

  utils.setPing(startTime);

  utils.events.emit('command_ready', { context, utils });
  logger('command executed');
}
