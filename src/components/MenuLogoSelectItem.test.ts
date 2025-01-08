import { html, fixture, expect } from '@open-wc/testing';
import './MenuLogoSelectItem';
import type { MenuLogoSelectItem } from './MenuLogoSelectItem';
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
const selectedItems: LogoItem[] = [items[0], items[1]];
const onToggleItem = sinon.spy();

describe('MenuLogoSelectItem Component', () => {
  it('should render correctly', async () => {
    const el = await fixture<MenuLogoSelectItem>(html`
      <my-menu-logo-select-item
        .items="s${items}"
        .selectedItems=${selectedItems}
        .onToggleItem=${onToggleItem}
      >
      </my-menu-logo-select-item>
    `);

    expect(el).to.exist; // Chai matcher to check existence
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('.item-selector')).to.exist;
  });

  it('should render a list of items', async () => {
    const el = await fixture<MenuLogoSelectItem>(html`
      <my-menu-logo-select-item
        .items=${items}
        .selectedItems=${selectedItems}
        .onToggleItem=${onToggleItem}
      >
      </my-menu-logo-select-item>
    `);

    const itemElements = el.shadowRoot?.querySelectorAll('my-button');
    expect(itemElements?.length).to.equal(items.length);
  });

  it('should render selected items', async () => {
    const el = await fixture<MenuLogoSelectItem>(html`
      <my-menu-logo-select-item
        .items=${items}
        .selectedItems=${selectedItems}
        .onToggleItem=${onToggleItem}
      >
      </my-menu-logo-select-item>
    `);

    const itemElements = el.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');
    if (itemElements) {
      itemElements.forEach((item, index) => {
        const button = item.shadowRoot?.querySelector('.button-img');
        if (button) {
          expect(button.classList.contains('selected')).to.equal(
            selectedItems.includes(items[index])
          );
        } else {
          expect.fail('No button found');
        }
      });
    } else {
      expect.fail('No items found');
    }
  });

  it('should toggle select items', async () => {
    const el = await fixture<MenuLogoSelectItem>(html`
      <my-menu-logo-select-item
        .items=${items}
        .selectedItems=${selectedItems}
        .onToggleItem=${onToggleItem}
      >
      </my-menu-logo-select-item>
    `);

    const itemElements = el.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');
    const firstButton =
      itemElements?.[0].shadowRoot?.querySelector('.button-img');
    expect(firstButton).to.exist;

    firstButton?.dispatchEvent(new MouseEvent('click'));
    expect(firstButton?.classList.contains('selected')).to.be.true;
  });

  it('should not select items', async () => {
    const el = await fixture<MenuLogoSelectItem>(html`
      <my-menu-logo-select-item
        .items=${items}
        .selectedItems=${selectedItems}
        .onToggleItem=${onToggleItem}
      >
      </my-menu-logo-select-item>
    `);

    const itemElements = el.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');
    const thirdButton =
      itemElements?.[2].shadowRoot?.querySelector('.button-img');
    expect(thirdButton).to.exist;

    thirdButton?.dispatchEvent(new MouseEvent('click'));
    expect(thirdButton?.classList.contains('selected')).to.be.false;
  });

  it('should copy info to clipboard', async () => {
    const el = await fixture<MenuLogoSelectItem>(html`
      <my-menu-logo-select-item
        .items=${items}
        .selectedItems=${selectedItems}
        .onToggleItem=${onToggleItem}
      >
      </my-menu-logo-select-item>
    `);

    const itemElements = el.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');
    const firstButton = itemElements?.[0];
    expect(firstButton).to.exist;

    const clipboardSpy = sinon.spy();
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardSpy,
      },
    });
    firstButton?.dispatchEvent(new MouseEvent('contextmenu'));

    expect(clipboardSpy).to.have.been.calledOnce;
  });

  it('should show no items info', async () => {
    const el = await fixture<MenuLogoSelectItem>(html`
      <my-menu-logo-select-item
        .items=${[]}
        .selectedItems=${[]}
        .onToggleItem=${onToggleItem}
      >
      </my-menu-logo-select-item>
    `);

    const noItemsInfo = el.shadowRoot?.querySelector(
      '[data-testid="no-items"]'
    );
    expect(noItemsInfo).to.exist;
  });
});
