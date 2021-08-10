/**
 * перед использованием удалите все //@ts-ignore
 */
//@ts-ignore
import { VK, getRandomId, MessageContext } from 'vk-io';
//@ts-ignore
import { Handler, IContext, IParams } from 'commander-core';
import { resolve } from 'path';
import Utils from './utils';

interface AdapterUtils extends Utils, IParams {}; //интерфейс утилит
interface AdapterContext extends MessageContext, IContext {}; //интерфейс контекста

const vk = new VK({
    token: '' // токен группы
})

const handler = new Handler<Utils>({
    commandsDirectory: resolve() + '/commands', //директория с командами
    params: new Utils() 
}) //создание экземпляра обработчика

handler.loadCommands().then(() => console.log('commands loaded')); //загружает команды

handler.listener.on('command_error', async(context: AdapterContext, bot: AdapterUtils, error: Error) =>{
	context.send(`Произошла непредвиденная ошибка`);

	if(bot.developerIds) {
		vk.api.messages.send({
			user_ids: bot.developerIds,
			random_id: getRandomId(), 
			message: `Ошибка в команде ${bot.command.name}: 
				${context.senderId} => ${context.command}
				${error.stack}`
		}) 
	}
}) // событие срабатывает при ошибке в командах и отправляет текст ошибки в лс разработчику

handler.listener.on('command_not_found', async(context: AdapterContext) =>{
	if(!context.isChat) {
		context.send(`Введенной вами команды не существует!`)
	} 
});

vk.updates.on('message_new', async(context) => {
    if(context.isGroup) return; //проверка на бота

    if(context.text) context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim(); //удаляет упоминание

	await handler.execute(context); //отправляет объект сообщения в обработчик
});

vk.updates.start().then(() => console.log('start'));