//@ts-ignore
import { Command, IContext } from 'commander-core';
//@ts-ignore
import { MessageContext } from 'vk-io';
import Utils from '../utils';

export default new Command({
	pattern: /^тест\s(.*|$)/i,
	name: 'тест',
	description: 'проверка работоспособности',
	
	params: {
		commandType: 'тест'
	},

	handler(ctx: MessageContext & IContext, bot: Utils) {
		bot.testMetods();
		//@ts-ignore
		ctx.send('тест');
		return;
	},
	
	commands: [
		new Command({
			pattern: /^тост$/i,
			name: 'тест тост',
			description: 'тост',
			params: {
				commandType: 'подкоманда'
			},
			handler(ctx: MessageContext & IContext, bot: Utils ) {
				//@ts-ignore
				ctx.send('тост');
				return;
			}
		})
	]
})