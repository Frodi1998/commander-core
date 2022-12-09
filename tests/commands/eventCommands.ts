import { Command, ICommand } from '../../dist/main.js';
import { MessageCTX } from '../context.js';
import { Utils } from '../utils.js';

export default new Command({
  pattern: /^event\s(.*)$/i,
  name: 'event',
  handler(context: MessageCTX & ICommand, bot: Utils) {
    const params = {
      context,
      utils: bot,
    };

    bot.events.emit(context.body[1], params);
  },
});
