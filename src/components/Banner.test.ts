import { html, fixture, expect } from '@open-wc/testing';
import './Banner';
import type { Banner } from './Banner';
import type { LogoItem } from 'types/LogoItem';
import { Categories } from 'types/Categories';

describe('Banner Component', () => {
  let el: Banner;
  const mockItems: LogoItem[] = [
    {
      id: '1',
      title: 'Logo 1',
      description: 'Description for Logo 1',
      url: 'https://logo1.com',
      svgContent: '<svg><circle cx="10" cy="10" r="5"/></svg>',
      category: Categories.Framework,
      path: '',
    },
    {
      id: '2',
      title: 'Logo 2',
      description: 'Description for Logo 2',
      url: 'https://logo2.com',
      svgContent: '<svg><rect x="5" y="5" width="10" height="10"/></svg>',
      category: Categories.Library,
      path: '',
    },
  ];

  beforeEach(async () => {
    el = await fixture<Banner>(
      html`<my-banner .items=${mockItems}></my-banner>`
    );
  });

  it('should render correctly with items', () => {
    expect(el).to.exist;

    const bannerGrid = el.shadowRoot?.querySelector('.banner-grid');
    expect(bannerGrid).to.exist;

    const buttons = bannerGrid?.querySelectorAll('my-button');
    expect(buttons?.length).to.equal(mockItems.length);

    const firstButton = buttons?.[0];
    expect(firstButton).to.exist;
    expect(firstButton?.getAttribute('title')).to.include(mockItems[0].title);
    expect(firstButton?.getAttribute('title')).to.include(
      mockItems[0].description
    );
    expect(firstButton?.getAttribute('title')).to.include(mockItems[0].url);

    const logo = firstButton?.querySelector('my-logo');
    expect(logo).to.exist;
    expect((logo as HTMLElement).getAttribute('item')).to.exist;
  });

  it('should remove an item when unselect is triggered', async () => {
    const firstButton = el.shadowRoot
      ?.querySelector('.banner-grid')
      ?.querySelectorAll('my-button')[0];
    firstButton?.dispatchEvent(new Event('click'));

    await el.updateComplete;

    const bannerGrid = el.shadowRoot?.querySelector('.banner-grid');
    const buttons = bannerGrid?.querySelectorAll('my-button');
    expect(buttons?.length).to.equal(mockItems.length - 1);
    expect(buttons?.[0]?.getAttribute('title')).to.include(mockItems[1].title);
  });

  it('should dispatch a selection-changed event when an item is unselected', async () => {
    const listener = new Promise<{ detail: any }>((resolve) =>
      el.addEventListener('selection-changed', ((e: CustomEvent) =>
        resolve({ detail: e.detail })) as EventListener)
    );

    const firstButton = el.shadowRoot
      ?.querySelector('.banner-grid')
      ?.querySelectorAll('my-button')[0];
    firstButton?.dispatchEvent(new Event('click'));

    const event = await listener;
    expect(event.detail).to.exist;
    expect(event.detail.selectedItems).to.deep.equal([mockItems[1]]);
  });

  it('should render an empty banner when no items are provided', async () => {
    el = await fixture<Banner>(html`<my-banner .items=${[]}></my-banner>`);
    expect(el).to.exist;

    const bannerGrid = el.shadowRoot?.querySelector('.banner-grid');
    expect(bannerGrid).to.exist;
    const buttons = bannerGrid?.querySelectorAll('my-button');
    expect(buttons?.length).to.equal(0);
  });

  it('should be accessible', async () => {
    await expect(el).to.be.accessible();
  });
});
