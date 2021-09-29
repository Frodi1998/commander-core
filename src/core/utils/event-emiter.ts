import { EventEmitter } from 'events';
import { UtilsCore } from '.';

interface IListener {
  context: Record<string, unknown>,
  utils: UtilsCore,
  error?: Error
}

interface EventListener {
  on(event: 'command_begin', listener: (data: IListener) => void): this;
  on(event: 'command_job', listener: (data: IListener) => void): this;
  on(event: 'command_error', listener: (data: IListener) => void): this;
  on(event: 'command_ready', listener: (data: IListener) => void): this;
  on(event: 'command_not_found', listener: (data: IListener) => void): this;
}

class EventListener extends EventEmitter {}

export default EventListener