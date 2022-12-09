import { UtilsCore } from '../..';

/**
 * класс утилит, понадобится для использования своих методов и констант в командах
 * bot.testMetods() в теле команды
 */
export default class Utils extends UtilsCore {
  adminIds = [1]; //ID разработчика в вк
  testMetods(): void {
    return console.log('test');
  }
}
