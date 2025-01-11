import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { convertCategoriesToLogoItems } from './convertCategories';
import type { CategoryItem } from 'types/CategoryItem';
import type { LogoItem } from 'types/LogoItem';
import { Categories } from 'types/Categories';

// Mocking isCategoryItem for the tests
import { isCategoryItem } from 'types/CategoryItem';

vi.mock('types/CategoryItem', () => ({
  isCategoryItem: vi.fn(),
}));

describe('convertCategoriesToLogoItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty array if categories is not an array', () => {
    const result = convertCategoriesToLogoItems(null);
    expect(result).toEqual([]);
  });

  it('should return an empty array if categories array is empty', () => {
    const result = convertCategoriesToLogoItems([]);
    expect(result).toEqual([]);
  });

  it('should return an empty array if not all elements are valid CategoryItems', () => {
    (isCategoryItem as unknown as Mock).mockReturnValue(false);

    const invalidCategories = [{ invalid: true }];
    const result = convertCategoriesToLogoItems(invalidCategories);

    expect(isCategoryItem).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should convert valid categories to unique LogoItems', () => {
    (isCategoryItem as unknown as Mock).mockImplementation((item) => {
      return 'items' in item;
    });

    const mockCategories: CategoryItem[] = [
      {
        items: [
          {
            id: 'logo1',
            title: 'Logo 1',
            description: '',
            category: Categories.Software,
            path: '',
            svgContent: '',
            url: '',
          },
          {
            id: 'logo2',
            title: 'Logo 2',
            description: '',
            category: Categories.Software,
            path: '',
            svgContent: '',
            url: '',
          },
        ],
        id: '',
        title: 0,
        count: 0,
      },
      {
        items: [
          {
            id: 'logo2',
            title: 'Logo 2',
            description: '',
            category: Categories.Software,
            path: '',
            svgContent: '',
            url: '',
          }, // Duplicate
          {
            id: 'logo3',
            title: 'Logo 3',
            description: '',
            category: Categories.Software,
            path: '',
            svgContent: '',
            url: '',
          },
        ],
        id: '',
        title: 0,
        count: 0,
      },
    ];

    const expectedLogoItems: LogoItem[] = [
      {
        id: 'logo1',
        title: 'Logo 1',
        description: '',
        category: Categories.Software,
        path: '',
        svgContent: '',
        url: '',
      },
      {
        id: 'logo2',
        title: 'Logo 2',
        description: '',
        category: Categories.Software,
        path: '',
        svgContent: '',
        url: '',
      },
      {
        id: 'logo3',
        title: 'Logo 3',
        description: '',
        category: Categories.Software,
        path: '',
        svgContent: '',
        url: '',
      },
    ];

    const result = convertCategoriesToLogoItems(mockCategories);

    expect(isCategoryItem).toHaveBeenCalledTimes(mockCategories.length);
    expect(result).toEqual(expectedLogoItems);
  });

  it('should log a warning if categories data is invalid', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      return;
    });
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
      return;
    });

    (isCategoryItem as unknown as Mock).mockReturnValue(false);

    const invalidCategories = [{ invalid: true }];
    convertCategoriesToLogoItems(invalidCategories);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'convertCategoriesToLogoItems: Invalid categories data'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(invalidCategories);

    consoleWarnSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});
