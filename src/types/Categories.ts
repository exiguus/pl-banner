import { tCategory } from './svgl/categories';

export enum Categories {
  'All' = 'All',
  'AI' = 'AI',
  'Software' = 'Software',
  'Hardware' = 'Hardware',
  'Library' = 'Library',
  'Hosting' = 'Hosting',
  'Framework' = 'Framework',
  'Devtool' = 'Devtool',
  'Monorepo' = 'Monorepo',
  'CMS' = 'CMS',
  'Database' = 'Database',
  'Compiler' = 'Compiler',
  'Crypto' = 'Crypto',
  'Cybersecurity' = 'Cybersecurity',
  'Social' = 'Social',
  'Entertainment' = 'Entertainment',
  'Browser' = 'Browser',
  'Language' = 'Language',
  'Education' = 'Education',
  'Design' = 'Design',
  'Community' = 'Community',
  'Marketplace' = 'Marketplace',
  'Music' = 'Music',
  'Vercel' = 'Vercel',
  'Google' = 'Google',
  'Payment' = 'Payment',
  'void' = 'void(0)',
  'Authentication' = 'Authentication',
  'IoT' = 'IoT',
  'Home Automation' = 'Home Automation',
}

export const categories: tCategory[] = Object.values(Categories);
