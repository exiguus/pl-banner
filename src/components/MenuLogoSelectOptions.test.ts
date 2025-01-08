import { html, fixture, expect } from '@open-wc/testing';
import './MenuLogoSelectOptions';
import type { MenuLogoSelectOptions } from './MenuLogoSelectOptions';
import type { LogoItem } from 'types/LogoItem';
import { Categories } from 'types/Categories';
import sinon from 'sinon';

const items: LogoItem[] = [
  {
    title: 'Item1',
    category: Categories.Framework,
    id: 'id-1',
    description: '',
    path: '',
    url: '',
    svgContent: '',
  },
  {
    title: 'Item2',
    category: Categories.Library,
    id: 'id-2',
    description: '',
    path: '',
    url: '',
    svgContent: '',
  },
  {
    title: 'Item3',
    category: Categories.Monorepo,
    id: 'id-3',
    description: '',
    path: '',
    url: '',
    svgContent: '',
  },
];

const displayItems: LogoItem[] = [...items];
const onToggleItem = sinon.spy();
const selectAllItems = sinon.spy();
const unselectAllItems = sinon.spy();
const selectPreselectedItems = sinon.spy();
const selectRandom = sinon.spy();
const handleChangeDisplayItems = sinon.spy();

describe('MenuLogoSelectOptions Component', () => {
  it('should render correctly', async () => {
    const el = await fixture<MenuLogoSelectOptions>(html`
          <my-menu-logo-select-options
            .items=${items}
            .displayItems=${displayItems}
            .onToggleItem=${onToggleItem}
            .onSelectAll=${selectAllItems}
            .onUnselectAll=${unselectAllItems}
            .onSelectPreselected=${selectPreselectedItems}
            .onSelectRandom=${selectRandom}
            @change-display-items=${handleChangeDisplayItems}
          ></my-menu-select-options>  
    `);
    expect(el).to.exist; // Chai matcher to check existence
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('.menu')).to.exist;
  });

  it('should toggle item', async () => {
    const el = await fixture<MenuLogoSelectOptions>(html`
          <my-menu-logo-select-options
            .items=${items}
            .displayItems=${displayItems}
            .onToggleItem=${onToggleItem}
            .onSelectAll=${selectAllItems}
            .onUnselectAll=${unselectAllItems}
            .onSelectPreselected=${selectPreselectedItems}
            .onSelectRandom=${selectRandom}
            @change-display-items=${handleChangeDisplayItems}
          ></my-menu-select-options>  
    `);

    el.onToggleItem(items[0]);
    expect(onToggleItem.calledOnce).to.be.true;

    el.onToggleItem(items[1]);
    expect(onToggleItem.calledTwice).to.be.true;

    el.onToggleItem(items[2]);
    expect(onToggleItem.calledThrice).to.be.true;
  });

  it('should select all items', async () => {
    const el = await fixture<MenuLogoSelectOptions>(html`
          <my-menu-logo-select-options
            .items=${items}
            .displayItems=${displayItems}
            .onToggleItem=${onToggleItem}
            .onSelectAll=${selectAllItems}
            .onUnselectAll=${unselectAllItems}
            .onSelectPreselected=${selectPreselectedItems}
            .onSelectRandom=${selectRandom}
            @change-display-items=${handleChangeDisplayItems}
          ></my-menu-select-options>  
    `);

    el.onSelectAll();
    expect(selectAllItems.calledOnce).to.be.true;

    // click button to select all items
    const button = el.shadowRoot?.querySelector(
      '[data-testid="menu-select-all"]'
    );
    if (button) {
      button.dispatchEvent(new Event('click'));
    } else {
      throw new Error('Button not found');
    }
    expect(selectAllItems.calledTwice).to.be.true;
  });

  it('should unselect all items', async () => {
    const el = await fixture<MenuLogoSelectOptions>(html`
          <my-menu-logo-select-options
            .items=${items}
            .displayItems=${displayItems}
            .onToggleItem=${onToggleItem}
            .onSelectAll=${selectAllItems}
            .onUnselectAll=${unselectAllItems}
            .onSelectPreselected=${selectPreselectedItems}
            .onSelectRandom=${selectRandom}
            @change-display-items=${handleChangeDisplayItems}
          ></my-menu-select-options>  
    `);

    el.onUnselectAll();
    expect(unselectAllItems.calledOnce).to.be.true;

    // click button to unselect all items
    const button = el.shadowRoot?.querySelector(
      '[data-testid="menu-unselect-all"]'
    );
    if (button) {
      button.dispatchEvent(new Event('click'));
    } else {
      throw new Error('Button not found');
    }
    expect(unselectAllItems.calledTwice).to.be.true;
  });

  it('should select preselected items', async () => {
    const el = await fixture<MenuLogoSelectOptions>(html`
          <my-menu-logo-select-options
            .items=${items}
            .displayItems=${displayItems}
            .onToggleItem=${onToggleItem}
            .onSelectAll=${selectAllItems}
            .onUnselectAll=${unselectAllItems}
            .onSelectPreselected=${selectPreselectedItems}
            .onSelectRandom=${selectRandom}
            @change-display-items=${handleChangeDisplayItems}
          ></my-menu-select-options>  
    `);

    el.onSelectPreselected();
    expect(selectPreselectedItems.calledOnce).to.be.true;

    // click button to select preselected items
    const button = el.shadowRoot?.querySelector(
      '[data-testid="menu-preselected"]'
    );
    if (button) {
      button.dispatchEvent(new Event('click'));
    } else {
      throw new Error('Button not found');
    }
    expect(selectPreselectedItems.calledTwice).to.be.true;
  });

  it('should select random items', async () => {
    const el = await fixture<MenuLogoSelectOptions>(html`
          <my-menu-logo-select-options
            .items=${items}
            .displayItems=${displayItems}
            .onToggleItem=${onToggleItem}
            .onSelectAll=${selectAllItems}
            .onUnselectAll=${unselectAllItems}
            .onSelectPreselected=${selectPreselectedItems}
            .onSelectRandom=${selectRandom}
            @change-display-items=${handleChangeDisplayItems}
          ></my-menu-select-options>  
    `);

    el.onSelectRandom();
    expect(selectRandom.calledOnce).to.be.true;

    // click button to select random items
    const button = el.shadowRoot?.querySelector('[data-testid="menu-random"]');

    if (button) {
      button.dispatchEvent(new Event('click'));
    } else {
      throw new Error('Button not found');
    }
    expect(selectRandom.calledTwice).to.be.true;
  });
});
