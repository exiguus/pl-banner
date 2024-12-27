import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import { compileLitTemplates } from '@lit-labs/compiler';
import { resolve } from 'path';
const __dirname = new URL('.', import.meta.url).pathname;

const transformHtmlPlugin = (data: {
  [x: string]: any;
  title?: string;
  description?: string;
  disclaimer?: string;
}) => ({
  name: 'transform-html',
  transformIndexHtml: {
    enforce: 'pre' as const,
    transform(html: string) {
      return html.replace(/<%=\s*(\w+)\s*%>/gi, (match, p1) => data[p1] || '');
    },
  },
});

export default defineConfig(() => {
  return {
    root: 'src',
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
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
    test: {
      globals: true,
      testMatch: ['src/**/*.test.ts'],
      environment: 'jsdom',
      setupFiles: './test-setup.ts', // Optional setup for global configurations
      coverage: {
        exclude: [
          '**/*.test.ts',
          '**/*.spec.ts',
          'types/MyEvents.ts',
          'types/svgl/**.ts',
        ],
      },
    },
  };
});
