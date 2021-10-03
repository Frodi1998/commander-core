const { Command } = require('commander-core');

module.exports = new Command({
	pattern: /^тест\s(.*|$)/i,
	name: 'тест',
	description: 'проверка работоспособности',
	params: {
		commandType: 'тест'
	},
	handler(ctx) {
		ctx.send('успех')
	},
	commands: [
		new Command({
			pattern: /^тост$/i,
			name: 'тест тост',
			description: 'тост',
			params: {
				commandType: 'подкоманда'
			},
			handler(ctx) {
				ctx.send('тост')
			}
		})
	]
})