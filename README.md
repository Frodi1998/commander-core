commander-core - это ядро для вашего обработчика команд, основан на [cocoscore](https://www.npmjs.com/package/cocoscore), написан на [Node.js](https://nodejs.org)
модуль может работать не только с [vk-io](https://www.npmjs.com/package/vk-io) но и с [puregram](https://www.npmjs.com/package/puregram)

| 📚 [Документация](https://frodi1998.github.io/commander-core/) | 📝 [Примеры](https://github.com/Frodi1998/commander-core/tree/master/examples) | 💬 [Беседа](https://vk.me/join/AJQ1d9IUCxhdW8s6imiygUU1)
|---------------------|---------------------|---------------------|

Установка

## NPM
```shell
npm i commander-core
```
## Yarn
```shell
yarn add commander-core
```

# Использование
Пример основан на [vk-io](https://www.npmjs.com/package/vk-io), вы можете использовать другое
Сначало необходимо проинициализировать ваш проект
```shell
npm init -y
```

# JavaScript
далее в корне проекта создайте файл utils.js
поместите туда следующий код
```js
const { UtilsCore } = require('commander-core');
/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
class Utils extends UtilsCore {
	constructor() {
    this.adminIds = [1] //ваш ID в вк так же можете поместить сюда массив идентификаторов
  }

  testMetods() {
    return console.log('test')
  }
}

module.exports = Utils
```
далее создайте файл start.js
```js
const { Handler } = require('commander-core')
const { VK, getRandomId } = require('vk-io')
const path = require('path')

const Utils = require('./utils.js') //наши утилиты

const TOKEN = process.env.TOKEN //токен от группы
const vk = new VK({token: TOKEN})

const handler = new Handler({
	commands: {
		directory: path.resolve(__dirname, 'commands')
		// fromArray: [commands] //массив команд, используйте только один из двух методов загрузки команд
	}
	strictLoader: true, //строгость загрузки (проверяет есть ли команды иначе кидает ошибку)
	utils: new Utils() //загружаем наши утилиты в класс обработчика
});

handler.events.on('command_error', async({context, utils, error}) =>{
	context.send(`Произошла непредвиденная ошибка`)
	if(utils.adminIds) {
		vk.api.messages.send({
			user_ids: utils.adminIds,
			random_id: getRandomId(),
			message: `Ошибка в команде ${utils.getCommand.name}:
				${context.senderId} => ${context.$command}
				${error.stack}`
		})
	}
}); //событие срабатывания ошибок в команде

handler.events.on('command_not_found', async({context}) =>{
	if(!context.isChat) {
		context.send(`Введенной вами команды не существует!`)
	} 
}); //событие при отсутствие подходящей команды

handler.loadCommands()
.then(() => console.log('commands loaded')) // загружает команды
.catch(err => console.error(err)) // обязательно обрабатывайте ошибку

vk.updates.on('message_new', async(context, next) => {
	context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim();

	await handler.execute(context);
});

vk.updates.start()
.then(() => console.log('Старт'));
```
далее создаем папку commands
внутри папки создаем файл test.js
```js
//здесь и будет код команды
const { Command } = require('commander-core');

//по желанию вы можете объявить тут массив из команд
module.exports = new Command({
	pattern: /^(?:тест|test)$/i,
	name: 'тест',
	description: 'тестирование',

	handler(context, bot) {
		bot.testMetods() //созданная нами утилита в файле utils.js
		context.send('тест');
	}
})
```

# TypeScript
далее в корне проекта создайте файл utils.ts
поместите туда следующий код
```ts
import { UtilsCore } from 'commander-core';
/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
export class Utils extends UtilsCore {
  public adminIds = [1] //ваш ID в вк так же можете поместить сюда массив идентификаторов

  testMetods(): void {
    return console.log('test')
  }
}
```
далее создайте файл start.ts
```ts
import { Handler, IContext } from 'commander-core';
import { VK, getRandomId, MessageContext } from 'vk-io';
import path from 'path';

import Utils from './utils.js'; //наши утилиты

interface IListener {
	context: MessageContext & IContext;
	utils: Utils;
	error?: Error;
}

const TOKEN = process.env.TOKEN //токен от группы
const vk = new VK({token: TOKEN})

const handler = new Handler({
	commands: {
		directory: path.resolve(__dirname, 'commands') //директория команд
		// fromArray: [commands] //массив команд, используйте только один из двух методов загрузки команд
	}
	strictLoader: true, //строгость загрузки (проверяет есть ли команды иначе кидает ошибку)
	utils: new Utils() //загружаем наши утилиты в класс обработчика
});

handler.events.on('command_error', async({context, utils, error}: IListener) =>{
	context.send(`Произошла непредвиденная ошибка`)
	if(utils.adminIds) {
		vk.api.messages.send({
			user_ids: utils.adminIds,
			random_id: getRandomId(),
			message: `Ошибка в команде ${utils.getCommand.name}:
				${context.senderId} => ${context.$command}
				${error.stack}`
		})
	}
}); //событие срабатывания ошибок в команде

handler.events.on('command_not_found', async({context}: IListener) =>{
	if(!context.isChat) {
		context.send(`Введенной вами команды не существует!`)
	} 
}); //событие при отсутствие подходящей команды

handler.loadCommands()
.then(() => console.log('commands loaded')) // загружает команды
.catch(err => console.error(err)) // обязательно обрабатывайте ошибку

vk.updates.on('message_new', async(context, next) => {
	context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim();

	await handler.execute(context);
});

vk.updates.start()
.then(() => console.log('Старт'));
```
далее создаем папку commands
внутри папки создаем файл test.ts
```js
//здесь и будет код команды
import { Command, IContext } from 'commander-core';
import { Utils } from '../utils';
import { MessageContext } from 'vk-io';

//по желанию вы можете объявить тут массив из команд
export default new Command({
	pattern: /^(?:тест|test)$/i,
	name: 'тест',
	description: 'тестирование',

	handler(context: MessageContext & IContext, bot: Utils) {
		bot.testMetods() //созданная нами утилита в файле utils.js
		context.send('тест');
	}
})
```
