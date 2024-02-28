import assert from 'node:assert';

import { Handler, Command, UtilsCore } from '../dist/main.js';
import { MessageCTX } from './context.js';
import { Utils } from './utils.js';

import testCommand from './commands/testCommands.js';
import eventCommand from './commands/event.command.js';
import { CommandContextLayer } from '../dist/main.js';

const handler = new Handler<MessageCTX, Utils>({
  commands: {
    fromArray: [testCommand, eventCommand],
  },
  strictLoader: true,
});

handler.events.on('command_job', ({ context, utils }) => {
  if (utils.getCommand.categories.includes(['job'])) {
    console.log('command_job');
    return utils.setCommandStatus('stop');
  }
});

handler.events.on('command_ready', ({ context, utils }) => {
  const command = utils.getCommand;

  if (command.categories.includes('job')) {
    console.log('ready');
  }
});

export function fromArrayTest() {
  describe('handler', () => {
    describe('getCommands', () => {
      it('должен вернуть true, если в commands есть комманды', async () => {
        assert.equal(handler.commander.getCommands.length > 0, true);
      });
    });

    describe('find', async () => {
      const { commander } = handler;
      const context: CommandContextLayer<MessageCTX> = new MessageCTX('test');
      context.$command = 'test';

      it('должен найти и вернуть инстанс команды', async () => {
        const command = await commander.find(context);

        assert.equal(command instanceof Command, true);
      });
    });

    describe('test job command', () => {
      const commands = [
        new Command({
          pattern: /^job$/i,
          categories: ['job'],
          handler() {
            console.log('test job event');
          },
        }),
      ];

      handler.commander.addCommands(commands);

      it('job command', () => {
        const context = new MessageCTX('job');

        handler.execute(context);
      });
    });
  });
}
