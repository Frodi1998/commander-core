import assert from 'assert';
import path from 'path';

import { Handler, Command, IContext } from '..';
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

interface IListener {
  context: MessageCTX & IContext;
  utils: Utils;
  error?: Error;
}

interface IParams {
  context: MessageCTX & IContext;
  utils: Utils;
}

let storage: Storage;
let handler: Handler;

export function fromDirectoryTest() {
  before(async () => {
    storage = new Storage();
    await createHandler();
    await addListenerForHandler();
  });

  describe('handler', () => {
    describe('getCommands', () => {
      it('должен вернуть true, если в commands 1 и более команд', async () => {
        assert.equal(handler.commander.getCommands.length >= 1, true);
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
            },
          }),

          new CustomCommand({
            pattern: /^test2$/i,
            type: 'new',
            handler() {
              console.log('add new command2');
            },
          }),
        ];

        handler.commander.addCommands(commands);

        const newCommands = handler.commander.getCommands.filter(
          x => x.type === 'new',
        );

        assert.strictEqual(newCommands.length, 2);
      });
    });

    describe('find', async () => {
      const { commander } = handler;
      const context = new MessageCTX();
      context.$command = 'test';

      it('должен найти и вернуть инстанс команды', async () => {
        const command = await commander.find(context);

        assert.equal(command instanceof Command, true);
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
          const state = storage.get<string>('command_begin');

          assert.equal(state, 'begin');
        });

        it('должен вернуть параметры события', () => {
          const params = storage.get<IParams>('begin_params');

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
          const state = storage.get<string>('command_job');

          assert.equal(state, 'job');
        });

        it('должен вернуть true, если utils экземпляр Utils', () => {
          const params = storage.get<IParams>('job_params');
          assert.equal(params.utils instanceof Utils, true);
        });

        it('должен вернуть test', () => {
          const params = storage.get<IParams>('job_params');
          assert.equal(params.context.text, 'test');
        });
      });
    });

    describe('utils', () => {
      it('execute', async () => {
        const context = new MessageCTX();
        context.text = 'utils test';

        await handler.execute(context);
      });

      it('должен вернуть тест', () => {
        const { context } = storage.get<IParams>('begin_params');
        assert.equal(context.text, 'test');
      });

      it('должен вернуть true если utils экземпляр Utils', () => {
        const { utils } = storage.get<IParams>('begin_params');
        assert.equal(utils instanceof Utils, true);
      });
    });
  });
}

async function createHandler() {
  handler = new Handler({
    commands: {
      directory: path.join(__dirname, 'commands'),
    },
    strictLoader: true,
    utils: new Utils(),
  });

  handler
    .loadCommands()
    .then(() => console.log('commands loaded'))
    .catch(err => console.error(err));
}

async function addListenerForHandler() {
  handler.events.on('command_begin', ({ context, utils }: IListener) => {
    const params: IParams = { context, utils };

    storage.set('command_begin', 'begin');
    storage.set('begin_params', params);
  });

  handler.events.on('command_job', ({ context, utils }: IListener) => {
    const params: IParams = { context, utils };

    storage.set('command_job', 'job');
    storage.set('job_params', params);
  });
}
