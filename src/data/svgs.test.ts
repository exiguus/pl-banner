import type { iSVG } from 'types/svgl/svg';
import { svgs } from 'data/svgs';
import { expect } from '@open-wc/testing';

describe('SVG Component', () => {
  it('svgl list should contain minimum 1 item', async () => {
    expect(svgs.length).to.be.greaterThan(0);
  });

  it('should have the correct typing', async () => {
    svgs.forEach((item: iSVG) => {
      expect(item.title).to.exist;
      expect(item.url).to.exist;
      expect(item.category).to.exist;
      expect(item.route).to.exist;

      if (item?.id) {
        expect(typeof item.id === 'number').to.be.true;
      }
      if (item?.wordmark) {
        expect(
          typeof item.wordmark === 'string' ||
          (typeof item.wordmark.dark === 'string' &&
            typeof item.wordmark.light === 'string'
          )
        ).to.be.true;
      }

      expect(typeof item.title === 'string').to.be.true;
      expect(typeof item.url === 'string').to.be.true;
      expect(
        typeof item.category === 'string' ||
        Array.isArray(item.category) &&
        item.category.every((category) => typeof category === 'string')
      ).to.be.true;
      expect(
        typeof item.route === 'string' ||
        (
          typeof item.route.dark === 'string' &&
          typeof item.route.light === 'string'
        )
      ).to.be.true;
    });
  });
});