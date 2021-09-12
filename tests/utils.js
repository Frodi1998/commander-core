"use strict";
exports.__esModule = true;
exports.utilsInstance = void 0;
var Utils = /** @class */ (function () {
    function Utils() {
        this.adminId = 1;
    }
    Utils.prototype.testMetod = function () {
        console.log('testMetod complit');
    };
    return Utils;
}());
exports["default"] = Utils;
exports.utilsInstance = new Utils();
