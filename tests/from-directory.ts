import assert from 'assert';
import path from 'path';

import { Handler, Command } from '../dist/main';
import { MessageCTX } from './context';
import { Storage } from './storage';
import Utils from './utils';

const storage = new Storage();

const handler = new Handler({
  commands: {
    directory: path.resolve(__dirname, 'commands')
  },
  strictLoader: true,
  utils: new Utils()
});

handler.events.on('command_begin', ({context, utils}) => {
  storage.set('command_begin', 'begin');
  storage.set('begin_params', {context, utils});
});

handler.loadCommands()
  .then(() => console.log('commands loaded'))
  .catch((err) => console.error(err));

export function fromDirectoryTest() {
  describe('handler', () => {
    describe('getCommands', () => {
      it('должен вернуть 0, если в commands нет комманд', async() => {
        assert.equal(
          handler.commander.getCommands.length > 0,
          true
        );
      });
    });

    describe('addCommands', () => {
      it('должен вернуть 2 добавленные команды', () => {
        const commands = [
          new Command({
            pattern: /^test1$/i,
            name: 'new',
            handler() {
              console.log('add new command1');
            }
          }),

          new Command({
            pattern: /^test2$/i,
            name: 'new',
            handler() {
              console.log('add new command2');
            }
          })
        ]

        handler.commander.addCommands(commands);

        const newCommands = handler.commander.getCommands.filter(x => x.name === 'new');

        assert.strictEqual(newCommands.length, 2);
      })
    })

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

    describe('events', () => {
      describe('command_begin', () => {
        it('execute', () => {
          const context = new MessageCTX();
          context.text = 'test';

          handler.execute(context);
        });

        it('должен вернуть begin', () => {
          const state = storage.get('command_begin');

          assert.equal(state, 'begin');
        });

        it('должен вернуть параметры события', () => {
          const params = storage.get('begin_params');

          assert.equal(params.utils instanceof Utils, true);
          assert.equal(params.context.text, 'test');
        });
      })
    })
  });
};