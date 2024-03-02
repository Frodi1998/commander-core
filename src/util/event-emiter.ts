import { EventEmitter } from 'events';
import {
  AnyObject,
  CommandContextLayer,
  CommandPayloadLayer,
} from '../main.js';

export interface ListenerContext<
  C extends AnyObject = AnyObject,
  U extends AnyObject = AnyObject,
> {
  context: CommandContextLayer<C>;
  utils: CommandPayloadLayer<U>;
  error?: Error;
}

export type CommandEventTypes =
  | 'command_not_found'
  | 'command_begin'
  | 'command_job'
  | 'command_ready'
  | 'command_stop'
  | 'command_error';

export interface CustomEventListener<
  T extends AnyObject = AnyObject,
  U extends AnyObject = AnyObject,
> {
  on(
    event: CommandEventTypes,
    listener: (ctx: ListenerContext<T, U>) => void,
  ): this;
  emit(event: CommandEventTypes, ctx: ListenerContext<T, U>): boolean;
}

// Класс EventListener с использованием дженериков
export class EventListener<
    C extends AnyObject = AnyObject,
    U extends AnyObject = AnyObject,
  >
  extends EventEmitter
  implements CustomEventListener<C, U>
{
  on(
    event: CommandEventTypes,
    listener: (ctx: ListenerContext<C, U>) => void,
  ): this {
    return super.on(event, listener);
  }

  emit(event: CommandEventTypes, ctx: ListenerContext<C, U>): boolean {
    return super.emit(event, ctx);
  }
}
