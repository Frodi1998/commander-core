import { CommandContextLayer } from '../dist/main.js';

export class MessageCTX {
  constructor(public text: string) {}
}

export type MyContext = CommandContextLayer<MessageCTX>;
