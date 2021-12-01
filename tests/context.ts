import { Context, IContext } from '../dist/types';

export class MessageCTX extends Context implements IContext {
  text: string;
  $command?: string;
  body?: RegExpMatchArray;
}
