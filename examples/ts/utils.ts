//@ts-ignore
import { utilsCore } from "commander-core";

/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
//@ts-ignore
export default class Utils extends UtilsCore {
    adminIds = [1] //ID разработчика в вк
    testMetods(): void {
        return console.log('test');
    }
}