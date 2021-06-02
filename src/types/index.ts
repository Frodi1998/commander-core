import { EventEmitter } from "events";
import { Commander } from "../commander";

export abstract class Context {
    public id?: number;
    
    public senderId?: number;

    public text?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;

    public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}
}

export interface IContext {
    text?: string,
    command?: string;
    body?: RegExpMatchArray;
}

export interface IParams {
    listener?: EventEmitter;
    commander?: Commander;
    command?: ICommand;
    ping?: number;
    // eslint-disable-next-line
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
    // eslint-disable-next-line
    handler: (context: any, bot: any) => void | Promise<void>;
}