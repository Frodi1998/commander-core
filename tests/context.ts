import { Context, IContext } from '../dist/types';

export class MessageCTX extends Context implements IContext {
  $command?: string;
  body?: RegExpMatchArray;
}
