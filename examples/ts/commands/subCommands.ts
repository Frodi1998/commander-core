//@ts-ignore
import { Command, IContext, IParams } from 'commander-core';
//@ts-ignore
import { MessageContext } from 'vk-io';
import Utils from '../utils';

interface AdapterUtils extends Utils, IParams {};
interface AdapterContext extends MessageContext, IContext {};

export default new Command({
	pattern: /^тест\s(.*|$)/i,
	name: 'тест',
	description: 'проверка работоспособности',
	
	params: {
		commandType: 'тест'
	},

	handler(ctx: AdapterContext, bot: AdapterUtils) {
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
			handler(ctx: AdapterContext, bot: AdapterUtils ) {
				//@ts-ignore
				ctx.send('тост');
				return;
			}
		})
	]
})