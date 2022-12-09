import assert from 'assert';

import { fromDirectoryTest } from './from-directory.js';
import { fromArrayTest } from './from-array.js';

describe('main', () => {
  describe('default test', function () {
    it('должен вернуть 4', function () {
      assert.equal(2 * 2, 4);
    });
  });

  describe('loading commands from directory', fromDirectoryTest);
  describe('loading commands from array', fromArrayTest);
});
