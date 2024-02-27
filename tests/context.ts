import { CommandContextLayer } from '../src/main';

export class MessageCTX implements CommandContextLayer {
  text: string;
  $command: string;
  body: RegExpMatchArray;
}
