import { html, fixture, expect } from '@open-wc/testing';
import './MenuSearch';
import type { MenuSearch } from './MenuSearch';
import { Categories } from 'types/Categories';
import type { LogoItem } from 'types/LogoItem';

const items: LogoItem[] = [
  {
    title: 'Item1',
    category: Categories.Framework,
    id: 'id-1',
    description: '',
    path: '',
    svgContent: '',
    url: '',
  },
  {
    title: 'Item2',
    category: Categories.Library,
    id: 'id-2',
    description: '',
    path: '',
    svgContent: '',
    url: '',
  },
  {
    title: 'Item3',
    category: Categories.Monorepo,
    id: 'id-3',
    description: '',
    path: '',
    svgContent: '',
    url: '',
  },
];

describe('MenuSearch Component', () => {
  it('should render correctly', async () => {
    const el = await fixture<MenuSearch>(
      html`<my-menu-search></my-menu-search>`
    );
    expect(el).to.exist; // Chai matcher to check existence
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('.menu')).to.exist;
  });

  it('should filter items based on search term', async () => {
    const el = await fixture<MenuSearch>(
      html`<my-menu-search
        .displayItems=${items}
        .items=${items}
      ></my-menu-search>`
    );

    el.performSearch('Item1');
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 300));

    expect(el.displayItems.length).to.equal(1);
    expect(el.displayItems[0].title).to.equal('Item1');
  });

  it('should clear the search term', async () => {
    const el = await fixture<MenuSearch>(
      html`<my-menu-search
        .displayItems=${items}
        .items=${items}
      ></my-menu-search>`
    );

    el.performSearch('Item1');
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 300));

    expect(el.displayItems.length).to.equal(1);
    expect(el.displayItems[0].title).to.equal('Item1');

    el.handleClear(new Event('click'));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 300));

    expect(el.displayItems.length).to.equal(3);
  });

  it('should filter items based on category', async () => {
    const el = await fixture<MenuSearch>(
      html`<my-menu-search
        .displayItems=${items}
        .items=${items}
      ></my-menu-search>`
    );

    el.performSearch('Framework');
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 300));

    expect(el.displayItems.length).to.equal(1);
    expect(el.displayItems[0].title).to.equal('Item1');
  });

  it('should filter items based on description', async () => {
    const el = await fixture<MenuSearch>(
      html`<my-menu-search
        .displayItems=${items}
        .items=${items}
      ></my-menu-search>`
    );

    el.performSearch('Item2');
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 300));

    expect(el.displayItems.length).to.equal(1);
    expect(el.displayItems[0].title).to.equal('Item2');
  });

  it('should filter items based on multiple search terms', async () => {
    const el = await fixture<MenuSearch>(
      html`<my-menu-search
        .displayItems=${items}
        .items=${items}
      ></my-menu-search>`
    );

    el.performSearch('Item1 Library');
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 300));

    expect(el.displayItems.length).to.equal(2);
    expect(el.displayItems[0].title).to.equal('Item1');
  });

  it('should be accessible', async () => {
    const el = await fixture<MenuSearch>(
      html`<my-menu-search></my-menu-search>`
    );
    await expect(el).to.be.accessible();
  });
});
