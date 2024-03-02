import { Command } from '../../dist/main.js';
import { MessageCTX, MyContext } from '../context.js';
import { Utils } from '../utils.js';

export default new Command({
  pattern: /^utils\s(.*)$/i,
  name: 'event',
  handler(context: MyContext, utils: Utils) {
    console.log('command => utils');

    const ctx = new MessageCTX(context.body![1]);

    return utils.executeCommand(ctx);
  },
});
