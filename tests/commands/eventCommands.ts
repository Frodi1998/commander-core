import { Command } from '../../dist/main';
import { MessageCTX } from '../context';
import Utils from '../utils';

export default new Command({
  pattern: /^event\s(.*)$/i,
  name: 'event',
  handler(context: MessageCTX, bot: Utils) {
    const params = {
      context,
      utils: bot,
    };

    bot.events.emit(context.body[1], params);
  },
});
