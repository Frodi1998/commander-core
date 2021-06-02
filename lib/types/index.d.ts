/// <reference types="node" />
import { EventEmitter } from "events";
import { Commander } from "../commander";
export declare abstract class Context {
    id?: number;
    senderId?: number;
    text?: string;
    [key: string]: any;
    get [Symbol.toStringTag](): string;
}
export interface IContext {
    text?: string;
    command?: string;
    body?: RegExpMatchArray;
}
export interface IParams {
    listener?: EventEmitter;
    commander?: Commander;
    command?: ICommand;
    ping?: number;
    [key: string]: any;
}
export interface IHandlerParams<T extends IParams = IParams> {
    commandsDirectory?: string;
    listener?: EventEmitter;
    commander?: Commander;
    ping?: number;
    command?: ICommand;
    params: T & IParams | IParams;
}
export interface ICommand {
    pattern: RegExp | string;
    name?: string;
    description?: string;
    params?: IParams | Record<string, unknown>;
    commands?: ICommand[] | [];
    handler: (context: any, bot: any) => void | Promise<void>;
}
