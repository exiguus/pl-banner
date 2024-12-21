import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import { compileLitTemplates } from '@lit-labs/compiler';
import { resolve } from 'path';
const __dirname = new URL('.', import.meta.url).pathname;

const transformHtmlPlugin = (data) => ({
  name: 'transform-html',
  transformIndexHtml: {
    enforce: 'pre',
    transform(html) {
      return html.replace(/<%=\s*(\w+)\s*%>/gi, (match, p1) => data[p1] || '');
    },
  },
});

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
      transformHtmlPlugin({
        title: 'My LinkedIn Banner',
        description:
          'Get your personalized LinkedIn banner with your favorite engineering SVG logos',
        disclaimer: 'This tool is not affiliated with LinkedIn &trade;',
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
