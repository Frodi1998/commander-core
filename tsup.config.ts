import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'tsup',
  target: 'node14',
  // sourcemap: true,
  splitting: true,
  entry: ['./src/main.ts'],
  // clean: true,
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    // build types for `src/index.ts` only
    // otherwise `Options` will not be exported by `tsup`, not sure how this happens, probably a bug in rollup-plugin-dts
    // entry: './src/main.ts',
  },
});
