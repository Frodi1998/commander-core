"use strict";
exports.__esModule = true;
var main_1 = require("../../dist/main");
var context_1 = require("../context");
exports["default"] = new main_1.Command({
    pattern: /^utils\s(.*)$/i,
    name: 'event',
    handler: function (context, bot) {
        console.log('command => utils');
        var ctx = new context_1.MessageCTX();
        ctx.text = context.body[1];
        bot.executeCommand(ctx);
    }
});
