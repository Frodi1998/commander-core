import { Context, IContext, IHandlerParams } from "../types";
export declare function contextHandler<c extends Context>(context: c & IContext, bot: IHandlerParams): Promise<void>;
