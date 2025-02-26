import { type CategoryItem, isCategoryItem } from 'types/CategoryItem';
import type { LogoItem } from 'types/LogoItem';

export const convertCategoriesToLogoItems = (
  categories: unknown
): LogoItem[] => {
  if (
    !Array.isArray(categories) ||
    categories.length === 0 ||
    !categories.every((category) => isCategoryItem(category))
  ) {
    console.warn('convertCategoriesToLogoItems: Invalid categories data');
    console.log(categories);
    return [];
  }
  const uniqueItemsMap = new Map<string, LogoItem>();

  for (const category of categories as CategoryItem[]) {
    for (const item of category.items) {
      if (!uniqueItemsMap.has(item.id)) {
        uniqueItemsMap.set(item.id, item);
      }
    }
  }

  return Array.from(uniqueItemsMap.values());
};
