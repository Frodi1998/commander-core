/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
class Utils {
    constructor() {
        this.developerIds = [1] //ID разработчика в вк
    }
    
    testMetods() {
        return console.log('test');
    }
}

module.exports = Utils