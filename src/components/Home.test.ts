import { html, fixture, expect } from '@open-wc/testing';
import './Home'; // Import the Home component
import { Home } from './Home';
import type { LogoItem } from 'types/LogoItem';
import { Categories } from 'types/Categories';

describe('Home Component', () => {
  let el: Home;
  const mockItems: LogoItem[] = [
    {
      id: '1',
      title: 'Logo 1',
      description: 'Desc 1',
      url: 'https://example.com',
      svgContent: '',
      category: Categories.Framework,
      path: '',
    },
    {
      id: '2',
      title: 'Logo 2',
      description: 'Desc 2',
      url: 'https://example.com',
      svgContent: '',
      category: Categories.Library,
      path: '',
    },
    {
      id: '3',
      title: 'Logo 3',
      description: 'Desc 3',
      url: 'https://example.com',
      svgContent: '',
      category: Categories.Marketplace,
      path: '',
    },
  ];

  beforeEach(async () => {
    el = await fixture<Home>(
      html`<my-home
        .allItems=${mockItems}
        .preselectedItems=${[mockItems[0]]}
      ></my-home>`
    );
  });

  it('should render correctly', async () => {
    expect(el).to.exist;

    // Check if the container exists
    const container = el.shadowRoot?.querySelector('.container');
    expect(container).to.exist;

    // Check if my-banner exists
    await new Promise((resolve) =>
      setTimeout(resolve, Home.showProfileIdTimeout + 500)
    );
    const banner = el.shadowRoot?.querySelector('my-banner');
    expect(banner).to.exist;

    // Check if my-menu exists
    const menu = el.shadowRoot?.querySelector('my-menu');
    expect(menu).to.exist;
  });

  it('should handle selection-changed event', async () => {
    await new Promise((resolve) =>
      setTimeout(resolve, Home.showProfileIdTimeout + 500)
    );
    const banner = el.shadowRoot?.querySelector('my-banner')!;
    banner.dispatchEvent(
      new CustomEvent('selection-changed', {
        detail: {
          selectedItems: [mockItems[1]],
          random: false,
          scrollIntoView: false,
        },
        bubbles: true,
        composed: true,
      })
    );

    await el.updateComplete;

    // Validate the banner items
    const updatedBanner = el.shadowRoot?.querySelector('my-banner');
    expect(updatedBanner).to.exist;

    const bannerItem = updatedBanner?.shadowRoot
      ?.querySelector('my-button')
      ?.getAttribute('title');
    expect(bannerItem).to.include(mockItems[1].title);
    expect(bannerItem).to.include(mockItems[1].description);
    expect(bannerItem).to.include(mockItems[1].url);
  });

  it('should update banner width on width-changed event', async () => {
    const menu = el.shadowRoot?.querySelector('my-menu')!;
    menu.dispatchEvent(
      new CustomEvent('width-changed', {
        detail: { width: 80 },
        bubbles: true,
        composed: true,
      })
    );

    await el.updateComplete;

    // Validate banner width via CSS property
    const computedStyle = getComputedStyle(el);
    expect(
      computedStyle.getPropertyValue('--banner-inner-width').trim()
    ).to.equal('80%');
  });

  it('should randomize order when randomizeOrder is called', async () => {
    el = await fixture<Home>(
      html`<my-home
        .allItems=${mockItems}
        .preselectedItems=${mockItems}
      ></my-home>`
    );

    const originalOrder = [...mockItems];
    const randomizedItems = el.shadowRoot
      ?.querySelector('my-menu')
      ?.dispatchEvent(
        new CustomEvent('randomize', {
          bubbles: true,
          composed: true,
        })
      );

    expect(randomizedItems).to.not.deep.equal(originalOrder);
  });

  it('should sort items correctly', async () => {
    el = await fixture<Home>(
      html`<my-home
        .allItems=${mockItems}
        .preselectedItems=${[mockItems[1], mockItems[0]]}
      ></my-home>`
    );
    await new Promise((resolve) =>
      setTimeout(resolve, Home.showProfileIdTimeout + 500)
    );

    const menu = el.shadowRoot?.querySelector('my-menu')!;
    menu.dispatchEvent(
      new CustomEvent('sort', {
        detail: { direction: 'asc' },
        bubbles: true,
        composed: true,
      })
    );

    await el.updateComplete;

    // Validate sorted order
    const sortedAsc = el.shadowRoot
      ?.querySelector('my-banner')
      ?.shadowRoot?.querySelectorAll('my-button');
    expect(sortedAsc).to.exist;
    expect(sortedAsc?.length).to.equal(2);
    expect(sortedAsc?.[0]?.getAttribute('title')).to.include(
      mockItems[1].title
    );
    expect(sortedAsc?.[1]?.getAttribute('title')).to.include(
      mockItems[0].title
    );
  });

  it('should render an empty banner when no items are provided', async () => {
    el = await fixture<Home>(html`<my-home .allItems=${[]}></my-home>`);

    await new Promise((resolve) =>
      setTimeout(resolve, Home.showProfileIdTimeout + 500)
    );
    const banner = el.shadowRoot?.querySelector('my-banner');
    expect(banner).to.exist;
    const bannerItems = banner?.getAttribute('items');
    expect(bannerItems).to.equal(null);
  });

  it('should be accessible', async () => {
    el = await fixture<Home>(
      html`<my-home
        .allItems=${mockItems}
        .preselectedItems=${mockItems}
      ></my-home>`
    );
    await expect(el).to.be.accessible();
  });
});
