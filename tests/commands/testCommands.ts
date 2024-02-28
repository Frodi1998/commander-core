import { Command } from '../../dist/main.js';
import { MessageCTX } from '../context.js';

import { Utils } from '../utils.js';

export default new Command<MessageCTX, Utils>({
  pattern: /^(?:test|тест)$/i,
  async handler(ctx, bot) {
    console.log('command => ' + ctx.text);
    return bot.testMetod();
  },
});
