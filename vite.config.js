import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import { compileLitTemplates } from '@lit-labs/compiler';
import { resolve } from 'path';
const __dirname = new URL('.', import.meta.url).pathname;

export default defineConfig(({ command }) => {
  return {
    root: 'src',
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        transformers: {
          // fails in build mode because of already declared transformer
          before: [command === 's' && compileLitTemplates()],
          after: [],
        },
      }),
    ],
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
    },
    rollupOptions: {
      manifest: true,
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  };
});
