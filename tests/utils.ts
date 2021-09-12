import { IParams } from '../dist/main';

export default class Utils implements IParams {
    adminId = 1;

    testMetod() {
        console.log('testMetod complit');
    }
}

export const utilsInstance = new Utils()