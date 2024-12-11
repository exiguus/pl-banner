import { iSVG } from './svgl/svg';
export interface SvglItem extends iSVG {}

export const isSvglItem = (value: unknown): value is SvglItem =>
  typeof value === 'object' &&
  value !== null &&
  'title' in value &&
  typeof value.title === 'string' &&
  'category' in value &&
  (typeof value.category === 'string' || Array.isArray(value.category)) &&
  'route' in value &&
  (typeof value.route === 'string' || typeof value.route === 'object') &&
  (typeof value.route === 'object' ? value.route !== null : true) &&
  (typeof value.route === 'object' && value.route !== null
    ? 'dark' in value.route && 'light' in value.route
    : true) &&
  ('wordmark' in value
    ? typeof value.wordmark === 'string' || typeof value.wordmark === 'object'
    : true) &&
  ('wordmark' in value
    ? typeof value.wordmark === 'object'
      ? value.wordmark !== null
      : true
    : true) &&
  ('wordmark' in value
    ? typeof value.wordmark === 'object' && value.wordmark !== null
      ? 'dark' in value.wordmark && 'light' in value.wordmark
      : true
    : true) &&
  'url' in value;
