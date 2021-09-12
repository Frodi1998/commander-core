"use strict";
exports.__esModule = true;
var main_1 = require("../../dist/main");
exports["default"] = new main_1.Command({
    pattern: 'test',
    handler: function (ctx, bot) {
        console.log('command => ' + ctx.text);
        bot.testMetod();
    }
});
