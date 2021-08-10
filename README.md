commander-core - это ядро для вашего обработчика команд, основан на [cocoscore](https://www.npmjs.com/package/cocoscore), написан на [Node.js](https://nodejs.org)
модуль может работать не только с [vk-io](https://www.npmjs.com/package/vk-io) но и с [puregram](https://www.npmjs.com/package/puregram)

| 📚 [Документация](https://frodi1998.github.io/commander-core/) | 📝 [Примеры](https://github.com/Frodi1998/commander-core/tree/master/examples) | 💬 [Беседа](https://vk.me/join/AJQ1d9IUCxhdW8s6imiygUU1)
|---------------------|---------------------|---------------------|

Установка

## NPM
```
npm i commander-core
```
Использование

Пример основан на [vk-io](https://www.npmjs.com/package/vk-io), вы можете использовать другое
Сначало необходимо проинициализировать ваш проект
```
npm init -y
```
далее в корне проекта создайте файл utils.js
поместите туда следующий код
```js
/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
class Utils {
	constructor() {
        this.developerIds = [1] //ваш ID в вк так же можете поместить сюда массив идентификаторов
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
	commandsDirectory: path.resolve() + '/commands', //внимание, убедитесь что путь указан верно
	params: new Utils() //загружаем наши утилиты в класс обработчика
});

handler.listener.on('command_error', async(context, bot, error) =>{
	context.send(`Произошла непредвиденная ошибка`)
	if(bot.developerId) {
		vk.api.messages.send({
			user_ids: bot.developerId,
			random_id: getRandomId(),
			message: `Ошибка в команде ${bot.command.name}:
				${context.senderId} => ${context.command}
				${error.stack}`
		})
	}
}); //событие срабатывания ошибок в команде

handler.listener.on('command_not_found', async(context, bot) =>{
	if(!context.isChat) {
		context.send(`Введенной вами команды не существует!`)
	} 
}); //событие при отсутствие подходящей команды

handler.loadCommands()
.then(() => console.log('commands loaded')); //загружает команды

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
	description: 'проверка даты',

	params: {
		commandType: 'test' 
	}, //объект параметров команды, параметры создаются на свое усмотрение и используются для фильтрации команд

	handler(context, bot) {
		bot.testMetods() //созданная нами утилита в файле utils.js
		context.send('тест');
	}
})
```
При использовании первое сообщение проигнорируется так как загрузка команд происходит в момент обработки первой команды

#Обновление

свойство bot.commander.commands стало приватным, для просмотра используйте метод bot.commander.getCommands