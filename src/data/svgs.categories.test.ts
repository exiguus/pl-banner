import { expect } from '@open-wc/testing';
import { svgs } from 'data/svgs';
import { Categories } from 'types/Categories';

describe('SVG categories sync', () => {
  it('should keep data categories aligned with generated Categories enum', () => {
    const enumCategories = new Set<string>(Object.values(Categories));

    const usedCategories = Array.from(
      new Set(
        svgs.flatMap((item) =>
          Array.isArray(item.category) ? item.category : [item.category]
        )
      )
    );

    const missingCategories = usedCategories
      .filter((category) => !enumCategories.has(category))
      .sort((a, b) => a.localeCompare(b));

    expect(
      missingCategories,
      `Missing categories in generated enum: ${missingCategories.join(', ')}`
    ).to.deep.equal([]);
  });
});
