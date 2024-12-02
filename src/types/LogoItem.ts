export interface LogoItem {
  name: string;
  path: string;
  svgContent?: string;
}

export const isLogoItem = (value: unknown): value is LogoItem =>
  typeof value === 'object' &&
  value !== null &&
  'name' in value &&
  typeof value.name === 'string' &&
  'path' in value &&
  typeof value.path === 'string' &&
  ('svgContent' in value ? typeof value.svgContent === 'string' : true);
