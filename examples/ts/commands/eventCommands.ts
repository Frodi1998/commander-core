import { MessageContext } from 'vk-io';
import { Command, IContext, UtilsCore } from '../../..';
import Utils from '../utils';

export default new Command({
  pattern: /^(?:event|ивент)$/i,
  name: 'event',
  description: 'создание события',

  handler(context: MessageContext & IContext, bot: Utils) {
    const params = { context, utils: bot };
    bot.events.emit('test_command', params);
    return;
  },
}); //создание своего события
