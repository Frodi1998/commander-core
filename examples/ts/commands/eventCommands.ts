//@ts-ignore
import { MessageContext } from "vk-io";
//@ts-ignore
import { Command, IContext, IParams } from "commander-core";
import Utils from "../utils";

interface AdapterUtils extends Utils, IParams {};
interface AdapterContext extends MessageContext, IContext {};

export default new Command({
    pattern: /^(?:event|ивент)$/i,
    name: 'event',
    description: 'создание события',

    handler(context: AdapterContext, bot: AdapterUtils) {
        //@ts-ignore
        bot.listener.emit('test_command', context, bot);
        return;
    }
}) //создание своего события