import type { Categories } from './Categories';
import { isLogoItem, type LogoItem } from './LogoItem';

export type CategoryItem = {
  id: string;
  title: keyof Categories;
  selected?: boolean;
  items: LogoItem[];
  count: number;
};

export const isCategoryItem = (value: unknown): value is CategoryItem =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  'title' in value &&
  'items' in value &&
  'count' in value &&
  typeof value.id === 'string' &&
  typeof value.title === 'string' &&
  Array.isArray(value.items) &&
  value.items.every((item) => {
    const isItemLogo = isLogoItem(item);
    if (!isItemLogo) {
      console.warn('isCategoryItem: Invalid item in items array');
      console.log(item);
    }
    return isItemLogo;
  }) &&
  typeof value.count === 'number';
