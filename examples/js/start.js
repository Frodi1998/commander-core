const { VK } = require('vk-io');
const { Handler } = require('commander-core');
const path = require('path');
const Utils = require('./utils');

const currentFile = path.resolve() //расположение текущего файла

const vk = VK({
    token: '' // токен группы
})

const handler = new Handler({
    commandsDir: currentFile + '/commands', //директория с командами
    params: new Utils() 
}) //создание экземпляра обработчика

handler.listener.on('command_error', async(context, bot, error) =>{
	context.send(`Произошла непредвиденная ошибка`);

	if(bot.developerId) {
		vk.api.messages.send({
			user_ids: bot.developerId,
			message: `Ошибка в команде ${bot.command.name}:
				${context.senderId} => ${context.command}
				${error.stack}`
		}) 
	}
}) // событие срабатывает при ошибке в командах и отправляет текст ошибки в лс разработчику

vk.updates.on('message_new', async(context) => {
    if(context.isGroup) return; //проверка на бота

    if(context.text) context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim(); //удаляет упоминание

	await handler.execute(context); //отправляет объект сообщения в обработчик
});

vk.updates.start().then(console.log('start'));