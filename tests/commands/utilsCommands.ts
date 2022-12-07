import { Command, ICommand } from '../../dist/main.js';
import { MessageCTX } from '../context.js';
import { Utils } from '../utils.js';

export default new Command({
  pattern: /^utils\s(.*)$/i,
  name: 'event',
  handler(context: MessageCTX & ICommand, bot: Utils) {
    console.log('command => utils');

    const ctx = new MessageCTX();
    ctx.text = context.body[1];

    return bot.executeCommand(ctx);
  },
});
