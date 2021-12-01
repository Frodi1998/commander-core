import { Command } from '../../dist/main';
import { MessageCTX } from '../context';
import Utils from '../utils';

export default new Command({
  pattern: /^utils\s(.*)$/i,
  name: 'event',
  handler(context: MessageCTX, bot: Utils) {
    console.log('command => utils');

    const ctx = new MessageCTX();
    ctx.text = context.body[1];

    bot.executeCommand(ctx);
  },
});
