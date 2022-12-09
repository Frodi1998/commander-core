import { Context, IContext } from '../dist/main.js';

export class MessageCTX implements Context, IContext {
  text: string;
  $command: string;
  body: RegExpMatchArray;
}
