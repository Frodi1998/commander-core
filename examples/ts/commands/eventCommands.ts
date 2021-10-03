//@ts-ignore
import { MessageContext } from "vk-io";
//@ts-ignore
import { Command, IContext } from "commander-core";
import Utils from "../utils";

export default new Command({
    pattern: /^(?:event|ивент)$/i,
    name: 'event',
    description: 'создание события',

    handler(context: MessageContext & IContext, bot: Utils) {
        const params = {context, utils: bot};
        //@ts-ignore
        bot.events.emit('test_command', params);
        return;
    }
}) //создание своего события