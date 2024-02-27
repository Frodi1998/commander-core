import { Command, ICommand } from '../../src/main';
import { MessageCTX } from '../context.js';
import { Utils } from '../utils.js';

export default new Command<MessageCTX, Utils>({
  pattern: /^event\s(.*)$/i,
  name: 'event',
  handler(context, bot) {
    const params = {
      context,
      utils: bot,
    };

    bot.events.emit(context.body[1], params);
  },
});
