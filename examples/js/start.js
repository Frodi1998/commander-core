const { VK, getRandomId } = require('vk-io');
const { Handler } = require('commander-core');
const path = require('path');
const Utils = require('./utils');

const vk = new VK({
    token: '' // токен группы
})

const handler = new Handler({
    commands: {
		directory: resolve(__dirname, 'commands') //директория с командами
	},
    strictLoader: true,
    utils: new Utils() 
}) //создание экземпляра обработчика

handler.events.on('command_error', async({context, utils, error}) =>{
	context.send(`Произошла непредвиденная ошибка`);

	if(utils.developerIds) {
		vk.api.messages.send({
			user_ids: utils.developerIds,
			random_id: getRandomId(),
			message: `Ошибка в команде ${utils.getCommand.name}:
				${context.senderId} => ${context.command}
				${error.stack}`
		}) 
	}
}) // событие срабатывает при ошибке в командах и отправляет текст ошибки в лс разработчику

handler.events.on('command_not_found', async({context}) =>{
	if(!context.isChat) {
		context.send(`Введенной вами команды не существует!`)
	} 
}); //событие при отсутствие подходящей команды

handler.loadCommands()
.then(() => console.log('commands loaded')) //загружает команды
.catch((err) => console.error(err)) //обработайте ошибку

vk.updates.on('message_new', async(context) => {
    if(context.isGroup) return; //проверка на бота

    if(context.text) context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim(); //удаляет упоминание

	await handler.execute(context); //отправляет объект сообщения в обработчик
});

vk.updates.start().then(console.log('start'));