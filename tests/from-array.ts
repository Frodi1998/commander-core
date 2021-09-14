import assert from 'assert';

import { Handler, Command } from '../dist/main';
import { MessageCTX } from './context';
import Utils from './utils';

import testCommand from './commands/testCommands';
import eventCommand from './commands/eventCommands';

const handler = new Handler({
  commands: {
    fromArray: [testCommand, eventCommand]
  },
  strictLoader: true,
  utils: new Utils()
});

export function fromArrayTest() {
  describe('handler', () => {
    describe('getCommands', () => {
      it('должен вернуть 0, если в commands нет комманд', async() => {
        assert.equal(
          handler.commander.getCommands.length > 0,
          true
        );
      });
    });

    describe('find', async () => {
      const { commander } = handler;
      const context = new MessageCTX();
      context.$command = 'test';

      it('должен найти и вернуть инстанс команды', async() => {
        const command = await commander.find(context);

        assert.equal(
          command instanceof Command,
          true
        );
      });
    });
  });
}