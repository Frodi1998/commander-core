import { Context, IContext } from '../dist/types';

export class MessageCTX implements Context, IContext {
  text: string;
  $command: string;
  body: RegExpMatchArray;
}
