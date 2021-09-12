import { EventEmitter } from "events";
import { Commander } from "../core/commander";

export abstract class Context {
    public text?: string;
}

export interface IContext {
    text?: string,
    command?: string;
    body?: RegExpMatchArray;
}

export interface ICommand {
    pattern: RegExp | string;
    name?: string;
    description?: string;
    params?: Record<string, unknown>;
    commands?: ICommand[] | [];
    // eslint-disable-next-line
    handler: (context: any, bot: any) => void | Promise<void>;
}