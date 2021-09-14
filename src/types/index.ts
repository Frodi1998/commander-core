export abstract class Context {
    public text: string;
}

export interface IContext {
    $command?: string;
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