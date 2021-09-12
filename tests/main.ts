import assert from 'assert';
import path from 'path';

import { Handler, Context, IContext, Command } from '../dist/main';
import {utilsInstance as utils} from './utils';

class AdapterContext extends Context implements IContext {
  command: string;
}

const handler = new Handler({
  commandsDirectory: path.resolve(__dirname, 'commands'),
  params: utils
})

handler.loadCommands();

describe('main', function() {
  describe('default test', function() {
    it('должен вернуть 4', function() {
      assert.equal(2 * 2, 4);
    });
  });

  describe('handler', function() {
    describe('commander', function() {
      describe('getCommands', () => {
        it('должен вернуть 0, если в commands нет комманд', function() {
          assert.equal(
            handler.commander.getCommands.length,
            1
          );
        });
      });

      describe('find', () => {
        const context = new AdapterContext();
        context.command = 'test';
        
        const command = handler.commander.find(context)

        it('должен найти и вернуть инстанс команды', () => {
          assert.equal(
            command instanceof Command,
            true
          );
        });

        it('должен вернуть test', () => {
          assert.equal(
            command,
            true
          );
        })
      });
    });
    
  });
});