//@ts-ignore
import { IParams } from "commander-core";

/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
export default class Utils implements IParams {
    developerId = 1 //ID разработчика в вк
    testMetods(): void {
        return console.log('test');
    }
}