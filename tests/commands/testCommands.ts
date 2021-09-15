import { Command } from '../../dist/main';

import Utils from '../utils';

export default new Command({
    pattern: /^(?:test|тест)$/i,
    handler(ctx, bot: Utils) {
        console.log('command => ' + ctx.text);
        bot.testMetod()
    }
})