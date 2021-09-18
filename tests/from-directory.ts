import assert from 'assert';
import path from 'path';

import { Handler, Command } from '../dist/main';
import { MessageCTX } from './context';
import { Storage } from './storage';
import Utils from './utils';

class CustomCommand extends Command {
  type: string;

  constructor(props) {
    super(props);
    this.type = props.type;
  }
}

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

handler.events.on('command_job', ({context, utils}) => {
  storage.set('command_job', 'job');
  storage.set('job_params', {context, utils});
});

handler.loadCommands()
  .then(() => console.log('commands loaded'))
  .catch((err) => console.error(err));

export function fromDirectoryTest() {
  describe('handler', () => {
    describe('getCommands', () => {
      it('должен вернуть true, если в commands 1 и более комад', async() => {
        assert.equal(
          handler.commander.getCommands.length >= 1,
          true
        );
      });
    });

    describe('addCommands', () => {
      it('должен вернуть 2 добавленные команды', () => {
        const commands = [
          new CustomCommand({
            pattern: /^test1$/i,
            type: 'new',
            handler() {
              console.log('add new command1');
            }
          }),

          new CustomCommand({
            pattern: /^test2$/i,
            type: 'new',
            handler() {
              console.log('add new command2');
            }
          })
        ]

        handler.commander.addCommands(commands);

        const newCommands = handler.commander.getCommands.filter(x => x.type === 'new');

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
      });

      describe('command_job', () => {
        it('execute', () => {
          const context = new MessageCTX();
          context.text = 'test';

          handler.execute(context);
        });

        it('должен вернуть job', () => {
          const state = storage.get('command_job');

          assert.equal(state, 'job');
        });

        it('должен вернуть true, если utils экземпляр Utils', () => {
          const params = storage.get('job_params');
          assert.equal(params.utils instanceof Utils, true);
        });

        it('должен вернуть test', () => {
          const params = storage.get('job_params');
          assert.equal(params.context.text, 'test');
        })
      });
    });

    describe('utils', () => {
      it('execute', async () => {
        const context = new MessageCTX();
        context.text = 'utils test';

        await handler.execute(context);
      });

      it('должен вернуть тест', () => {
        const { context } = storage.get('begin_params');
        assert.equal(context.text, 'test');
      });

      it('должен вернуть true если utils экземпляр Utils', () => {
        const { utils } = storage.get('begin_params');
        assert.equal(utils instanceof Utils, true);
      });
    })
  });
};