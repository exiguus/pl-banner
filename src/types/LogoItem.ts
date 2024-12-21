import { Categories } from 'types/Categories';

export type LogoItem = {
  id: string;
  title: string;
  description: string;
  category: Categories | Categories[];
  path: string;
  svgContent: string;
  url: string;
};

export const isLogoItem = (value: unknown): value is LogoItem =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof value.id === 'string' &&
  'title' in value &&
  typeof value.title === 'string' &&
  'category' in value &&
  typeof value.category === 'string' &&
  'path' in value &&
  typeof value.path === 'string' &&
  'svgContent' in value &&
  typeof value.svgContent === 'string' &&
  'url' in value &&
  typeof value.url === 'string';
