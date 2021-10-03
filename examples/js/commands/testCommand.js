const { Command } = require('commander-core');

module.exports = new Command({
	pattern: /^тест$/i,
	name: 'тест',
	description: 'проверка работоспособности',
	params: {
		commandType: 'тест'
	},
	handler(ctx) {
		ctx.send('успех')
	}
})