import { register } from 'ts-node';
// import testTSConfig from './tsconfig-for-autotests.json';

register({
  files: true,
  transpileOnly: true,
  project: './tsconfig-for-autotests.json',
});
