"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextHandler = void 0;
async function contextHandler(context, bot) {
    const startTime = Date.now();
    const command = bot.commander.find(context);
    if (!command) {
        bot.listener.emit('command_not_found', context, bot.params);
        return;
    }
    bot.params.command = command;
    await Promise.all([
        bot.listener.emit('command_job', context, bot.params),
        command.handler(context, bot.params)
    ])
        .catch((error) => {
        bot.listener.emit('command_error', context, bot.params, error);
        return;
    });
    bot.ping = Date.now() - startTime;
    bot.listener.emit('command_ready', context, bot.params);
}
exports.contextHandler = contextHandler;
