import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import { compileLitTemplates } from '@lit-labs/compiler';
import svg from 'vite-plugin-svgo';
import { resolve } from 'node:path';
import fs from 'node:fs';
import i18n from './i18n.json';

const __dirname = new URL('.', import.meta.url).pathname;

export default defineConfig(() => {
  return {
    root: 'src',
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
      }),
      transformInlineJsonPlugin(),
      transformHtmlPlugin(i18n.en),
      svg(),
    ],
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      format: 'esm',
      chunkSizeWarningLimit: 2500,
      preserveModules: true,
      sourcemap: true,
      cssMinify: true,
      cssCodeSplit: true,
      minify: true,
      target: 'esnext',
      brotliSize: true,
      manifest: true,
      polyfillDynamicImport: true,
      modulePreload: true,
    },
    optimizeDeps: {
      force: true,
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

const transformHtmlPlugin = (data: {
  [x: string]: any;
  title?: string;
  description?: string;
  disclaimer?: string;
}) => ({
  name: 'transform-html',
  transformIndexHtml: {
    order: 'pre' as const,
    handler(html: string) {
      return html.replace(/<%=\s*(\w+)\s*%>/gi, (match, p1) => data[p1] || '');
    },
  },
});

const transformInlineJsonPlugin = () => ({
  name: 'transform-inline-json',
  transformIndexHtml: {
    order: 'pre' as const,
    handler(html: string) {
      const transformScript = (script: string) => {
        // Extract the "src" attribute from the script
        const srcMatch = script.match(/src="(.*?)"/);
        const src = srcMatch?.[1];
        if (!src) {
          console.warn(
            'transform-inline-json: No src attribute found in script.'
          );
          return script;
        }
        // Resolve the source file path
        const resolvedSrc = resolve(__dirname, 'src', src);
        console.info('transform-inline-json: Resolved src to:', resolvedSrc);

        if (!fs.existsSync(resolvedSrc)) {
          console.error('transform-inline-json: File not found:', resolvedSrc);
          return script;
        }
        try {
          // Read and parse the JSON file
          const data = fs.readFileSync(resolvedSrc, 'utf-8');
          const json = JSON.parse(data);
          // Extract the "id" attribute from the script
          const idMatch = script.match(/id="(.*?)"/);
          const id = idMatch?.[1];
          if (!id) {
            console.warn(
              'transform-inline-json: No id attribute found in script.'
            );
          }
          // Return the transformed script tag
          return `<script id="${id || ''}" type="application/json">${JSON.stringify(json)}</script>`;
        } catch (error) {
          console.error(
            'transform-inline-json: Error processing script:',
            error
          );
          return script;
        }
      };
      return html.replace(
        /<script[^>]*id\s*=\s*".*?"[^>]*type\s*=\s*"application\/json"[^>]*src\s*=\s*".*?"[^>]*>\s*<\/script>/gis,
        (script) => transformScript(script)
      );
    },
  },
});
