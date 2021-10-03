/**
 * перед использованием удалите все //@ts-ignore
 */
//@ts-ignore
import { VK, getRandomId, MessageContext } from 'vk-io';
//@ts-ignore
import { Handler, IContext } from 'commander-core';
import { resolve } from 'path';
import Utils from './utils';

interface IListener {
	context: MessageContext & IContext;
	utils: Utils;
	error?: Error;
}

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

handler.events.on('command_error', async({context, utils, error}: IListener) =>{
	context.send(`Произошла непредвиденная ошибка`);

	if(utils.adminIds) {
		vk.api.messages.send({
			user_ids: utils.adminIds,
			random_id: getRandomId(), 
			//@ts-ignore
			message: `Ошибка в команде ${utils.getCommand.name}: 
				${context.senderId} => ${context.command}
				${error.stack}`
		}) 
	}
}) // событие срабатывает при ошибке в командах и отправляет текст ошибки в лс разработчику

handler.events.on('command_not_found', async({context}: IListener) =>{
	if(!context.isChat) {
		context.send(`Введенной вами команды не существует!`)
	} 
});

handler.loadCommands()
.then(() => console.log('commands loaded')) //загружает команды
.catch((err: Error) => console.error(err)) //обработайте ошибку

vk.updates.on('message_new', async(context) => {
    if(context.isGroup) return; //проверка на бота

    if(context.text) context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim(); //удаляет упоминание

	await handler.execute(context); //отправляет объект сообщения в обработчик
});

vk.updates.start().then(() => console.log('start'));