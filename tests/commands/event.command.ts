import { Command, CommandContextLayer } from '../../dist/main.js';
import type { MessageCTX } from '../context.js';
import { Utils } from '../utils.js';

export default new Command<CommandContextLayer<MessageCTX>, Utils>({
  pattern: /^event\s(.*)$/i,
  name: 'event',
  handler(context, utils) {
    const params = {
      context,
      utils,
    };

    utils.events.emit(context.body![1], params);
  },
});
