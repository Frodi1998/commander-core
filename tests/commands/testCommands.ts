import { Command, ICommand } from '../../dist/main.js';
import { MessageCTX } from '../context.js';

import { Utils } from '../utils.js';

export default new Command({
  pattern: /^(?:test|тест)$/i,
  async handler(ctx: MessageCTX & ICommand, bot: Utils) {
    console.log('command => ' + ctx.text);
    return bot.testMetod();
  },
});
