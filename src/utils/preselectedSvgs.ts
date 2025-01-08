import type { LogoItem } from 'types/LogoItem';

export const PRESELECTED = [
  'apple-light',
  'apple-dark',
  'astro',
  'atlassian',
  'atom',
  'aws',
  'amazon-web-services',
  'auth0',
  'babel',
  'bash',
  'biomejs',
  'bootstrap',
  'brave',
  'bulma',
  'bun',
  'chart.js',
  'chrome',
  'chromium',
  'cloudflare',
  'cloudinary',
  'copilot',
  'css',
  'cypress',
  'discord',
  'docker',
  'edge',
  'esbuild',
  'express.js',
  'figma',
  'firefox',
  'gatsby',
  'gimp',
  'git',
  'github',
  'gitlab',
  'gmail',
  'go-dark',
  'go-light',
  'grafana',
  'graphql',
  'headless-ui',
  'homebrew',
  'html5',
  'ibm',
  'intellij-idea',
  'jasmine',
  'javascript',
  'jest',
  'json',
  'jwt',
  'kubernetes',
  'less',
  'linkedin',
  'linux',
  'lit',
  'mariadb',
  'markdown',
  'markdown-dark',
  'markdown-light',
  'mastodon',
  'million',
  'mistral',
  'monero',
  'mysql',
  'netlify',
  'next.js',
  'node.js',
  'npm',
  'nuxt',
  'nx',
  'nx-dark',
  'nx-light',
  'ollama',
  'ollama-dark',
  'ollama-light',
  'openai',
  'openai-dark',
  'openai-light',
  'opera',
  'parcel',
  'photoshop',
  'playwright',
  'pnpm',
  'postcss',
  'postgresql',
  'postman',
  'preact',
  'prettier',
  'raspberry',
  'react',
  'rest',
  'rust',
  'safari',
  'sass',
  'sentry',
  'sketch',
  'slack',
  'sqlite',
  'stack-overflow',
  'storybook',
  'storyblok',
  'strapi',
  'styled-components',
  'supabase',
  'svg',
  'swagger',
  'swc',
  'swr',
  'tailwind-css',
  'telegram',
  'terraform',
  'three.js',
  'tor',
  'travis',
  'turbopack',
  'turborepo',
  'typescript',
  'vercel',
  'vercel-dark',
  'vercel-light',
  'vercel-wordmark',
  'vercel-wordmark-dark',
  'vercel-wordmark-light',
  'vim',
  'vite',
  'vitest',
  'vscode',
  'vue',
  'vuetify',
  'web-components',
  'webkit',
  'webpack',
  'jetbrains-webstorm',
  'web.dev',
  'windows',
  'yarn',
  'zed',
  'zoom',
];

export const filterPreselected = (items: LogoItem[]): LogoItem[] =>
  items.filter((item) => PRESELECTED.some((id) => item.id.startsWith(id)));
