import { html, fixture, expect } from '@open-wc/testing';
import './MenuLogoSelect';
import type { MenuLogoSelect } from './MenuLogoSelect';
import type { LogoItem } from 'types/LogoItem';
import { Categories } from 'types/Categories';
import categories from '../data/categories.json';
import type { LitElement } from 'lit';

const items: LogoItem[] = [
  {
    title: 'Item1',
    category: Categories.Framework,
    id: 'vue',
    description: '',
    path: '',
    url: '',
    svgContent: '',
  },
  {
    title: 'Item2',
    category: Categories.Library,
    id: 'ahooks',
    description: '',
    path: '',
    url: '',
    svgContent: '',
  },
  {
    title: 'Item3',
    category: Categories.Devtool,
    id: 'nx-dark',
    description: '',
    path: '',
    url: '',
    svgContent: '',
  },
];
const selectedItems: LogoItem[] = [items[0], items[1]];

describe('MenuLogoSelect Component', () => {
  it('should render correctly', async () => {
    const el = await fixture<MenuLogoSelect>(html`
      <my-menu-logo-select .items=${items} .selectedItems=${selectedItems}>
      </my-menu-logo-select>
    `);

    expect(el).to.exist; // Chai matcher to check existence
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('.menu')).to.exist;
  });

  it('should render the correct items when perform a search', async () => {
    const el = await fixture<MenuLogoSelect>(html`
      <my-menu-logo-select .items=${items} .selectedItems=${selectedItems}>
      </my-menu-logo-select>
    `);

    const searchMenu = el.shadowRoot
      ?.querySelector('my-menu-logo-select-options')
      ?.shadowRoot?.querySelector('my-menu-search');
    const searchInput = searchMenu?.shadowRoot?.querySelector(
      '[data-testid="search-filter"]'
    );

    // type 'Item1' in the searchInput
    searchInput?.setAttribute('value', 'Item1');
    searchInput?.dispatchEvent(new Event('input'));

    // wait for the search to be performed
    await new Promise((r) => setTimeout(r, 600));

    const itemSelect = el.shadowRoot?.querySelector('my-menu-logo-select-item');

    const searchItems = itemSelect?.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');

    expect(searchItems?.length).to.equal(1);
    expect(searchItems?.[0].textContent).to.match(/Item1/);

    // type 'Item1 Item2' in the searchInput
    searchInput?.setAttribute('value', 'Item1 Item2');
    searchInput?.dispatchEvent(new Event('input'));

    // wait for the search to be performed
    await new Promise((r) => setTimeout(r, 600));

    const searchItems2 = itemSelect?.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');

    expect(searchItems2?.length).to.equal(2);
    expect(searchItems2?.[0].textContent).to.match(/Item2/);
    expect(searchItems2?.[1].textContent).to.match(/Item1/);
  });

  it('should render the correct items when filter by category', async () => {
    const el = await fixture<MenuLogoSelect>(html`
      <my-menu-logo-select .items=${items} .selectedItems=${selectedItems}>
      </my-menu-logo-select>
      <script id="categories" type="application/json">
        ${JSON.stringify(categories)}
      </script>
    `);

    const categoryMenu = el.shadowRoot
      ?.querySelector('my-menu-logo-select-options')
      ?.shadowRoot?.querySelector('my-menu-categories');

    if (categoryMenu) {
      await (categoryMenu as LitElement).updateComplete;
    } else {
      throw new Error('categoryMenu is not defined');
    }

    await new Promise((r) => setTimeout(r, 1200));

    const selectElement = categoryMenu.shadowRoot?.querySelector('select');
    if (!selectElement) {
      throw new Error('selectElement is not defined');
    }
    selectElement.querySelectorAll('option').forEach((option) => {
      option.selected = false;
    });
    console.log(selectElement);
    expect(selectElement?.selectedOptions.length).to.equal(0);

    if (selectElement) {
      const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true,
      });
      const option = selectElement.querySelector(
        `option[value="${String(items[0].category).toLowerCase()}"]`
      ) as HTMLOptionElement;
      if (option) {
        option.selected = true;
      } else {
        throw new Error('option is not defined');
      }
      selectElement.dispatchEvent(changeEvent);
    }

    expect(selectElement?.selectedOptions.length).to.equal(1);

    // wait for the search to be performed
    await new Promise((r) => setTimeout(r, 800));
    const itemSelect = el.shadowRoot?.querySelector('my-menu-logo-select-item');

    if (itemSelect) {
      await (itemSelect as LitElement).updateComplete;
    } else {
      throw new Error('itemSelect is not defined');
    }
    const categoryItems = itemSelect?.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');

    expect(categoryItems?.length).to.equal(1);
    expect(categoryItems?.[0].textContent).to.match(/Item1/);
  });

  it('should select all items', async () => {
    const el = await fixture<MenuLogoSelect>(html`
      <my-menu-logo-select .items=${items} .selectedItems=${items}>
      </my-menu-logo-select>
    `);

    const optionsMenu = el.shadowRoot?.querySelector(
      'my-menu-logo-select-options'
    );
    if (optionsMenu) {
      await (optionsMenu as LitElement).updateComplete;
    } else {
      throw new Error('optionsMenu is not defined');
    }
    const selectAllButton = optionsMenu.shadowRoot?.querySelector(
      '[data-testid="menu-select-all"]'
    );

    if (selectAllButton) {
      await (selectAllButton as LitElement).updateComplete;
      selectAllButton.dispatchEvent(new Event('click'));
    } else {
      throw new Error('selectAllButton is not defined');
    }

    await new Promise((r) => setTimeout(r, 800));

    const itemSelect = el.shadowRoot?.querySelector('my-menu-logo-select-item');

    if (itemSelect) {
      await (itemSelect as LitElement).updateComplete;
    } else {
      throw new Error('itemSelect is not defined');
    }
    const allItems = itemSelect?.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');

    expect(allItems?.length).to.equal(3);

    const firstButton = allItems?.[0].shadowRoot?.querySelector('.button-img');
    const secondButton = allItems?.[1].shadowRoot?.querySelector('.button-img');
    const thirdButton = allItems?.[2].shadowRoot?.querySelector('.button-img');

    if (!firstButton || !secondButton || !thirdButton) {
      throw new Error(
        'firstButton, secondButton or thirdButton is not defined'
      );
    }
    await (firstButton as LitElement).updateComplete;
    await (secondButton as LitElement).updateComplete;
    await (thirdButton as LitElement).updateComplete;
    expect(firstButton?.classList.contains('selected')).to.be.true;
    expect(secondButton?.classList.contains('selected')).to.be.true;
    expect(thirdButton?.classList.contains('selected')).to.be.true;

    expect(firstButton.outerHTML).to.match(/Item2/);
    expect(secondButton.outerHTML).to.match(/Item3/);
    expect(thirdButton.outerHTML).to.match(/Item1/);
  });

  it('should unselect all items', async () => {
    const el = await fixture<MenuLogoSelect>(html`
      <my-menu-logo-select .items=${items} .selectedItems=${items}>
      </my-menu-logo-select>
    `);

    const optionsMenu = el.shadowRoot?.querySelector(
      'my-menu-logo-select-options'
    );
    if (optionsMenu) {
      await (optionsMenu as LitElement).updateComplete;
    } else {
      throw new Error('optionsMenu is not defined');
    }
    const unselectAllButton = optionsMenu.shadowRoot?.querySelector(
      '[data-testid="menu-unselect-all"]'
    );

    if (unselectAllButton) {
      await (unselectAllButton as LitElement).updateComplete;
      unselectAllButton.dispatchEvent(new Event('click'));
    } else {
      throw new Error('unselectAllButton is not defined');
    }

    await new Promise((r) => setTimeout(r, 800));

    const itemSelect = el.shadowRoot?.querySelector('my-menu-logo-select-item');

    if (itemSelect) {
      await (itemSelect as LitElement).updateComplete;
    } else {
      throw new Error('itemSelect is not defined');
    }
    const allItems = itemSelect?.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');

    expect(allItems?.length).to.equal(3);

    const firstButton = allItems?.[0].shadowRoot?.querySelector('.button-img');
    const secondButton = allItems?.[1].shadowRoot?.querySelector('.button-img');
    const thirdButton = allItems?.[2].shadowRoot?.querySelector('.button-img');

    if (!firstButton || !secondButton || !thirdButton) {
      throw new Error(
        'firstButton, secondButton or thirdButton is not defined'
      );
    }
    await (firstButton as LitElement).updateComplete;
    await (secondButton as LitElement).updateComplete;
    await (thirdButton as LitElement).updateComplete;
    expect(firstButton?.classList.contains('selected')).to.be.false;
    expect(secondButton?.classList.contains('selected')).to.be.false;
    expect(thirdButton?.classList.contains('selected')).to.be.false;

    expect(firstButton.outerHTML).to.match(/Item2/);
    expect(secondButton.outerHTML).to.match(/Item3/);
    expect(thirdButton.outerHTML).to.match(/Item1/);
  });

  it('should select preselected items', async () => {
    const el = await fixture<MenuLogoSelect>(html`
      <my-menu-logo-select .items=${items} .selectedItems=${selectedItems}>
      </my-menu-logo-select>
    `);

    const optionsMenu = el.shadowRoot?.querySelector(
      'my-menu-logo-select-options'
    );
    if (optionsMenu) {
      await (optionsMenu as LitElement).updateComplete;
    } else {
      throw new Error('optionsMenu is not defined');
    }
    const selectPreselectedButton = optionsMenu.shadowRoot?.querySelector(
      '[data-testid="menu-preselected"]'
    );

    if (selectPreselectedButton) {
      await (selectPreselectedButton as LitElement).updateComplete;
      selectPreselectedButton.dispatchEvent(new Event('click'));
    } else {
      throw new Error('selectPreselectedButton is not defined');
    }

    await new Promise((r) => setTimeout(r, 800));

    const itemSelect = el.shadowRoot?.querySelector('my-menu-logo-select-item');

    if (itemSelect) {
      await (itemSelect as LitElement).updateComplete;
    } else {
      throw new Error('itemSelect is not defined');
    }
    const preselectedItems = itemSelect?.shadowRoot
      ?.querySelector('.item-selector')
      ?.querySelectorAll('my-button');

    expect(preselectedItems?.length).to.equal(3);

    const firstButton =
      preselectedItems?.[0].shadowRoot?.querySelector('.button-img');
    const secondButton =
      preselectedItems?.[1].shadowRoot?.querySelector('.button-img');
    const thirdButton =
      preselectedItems?.[2].shadowRoot?.querySelector('.button-img');

    if (!firstButton || !secondButton || !thirdButton) {
      throw new Error('firstButton or secondButton is not defined');
    }
    await (firstButton as LitElement).updateComplete;
    await (secondButton as LitElement).updateComplete;
    await (thirdButton as LitElement).updateComplete;
    expect(firstButton?.classList.contains('selected')).to.be.false;
    expect(secondButton?.classList.contains('selected')).to.be.true;
    expect(thirdButton?.classList.contains('selected')).to.be.true;

    expect(firstButton.outerHTML).to.match(/Item2/);
    expect(secondButton.outerHTML).to.match(/Item3/);
    expect(thirdButton.outerHTML).to.match(/Item1/);
  });

  it('should be accessible', async () => {
    const el = await fixture<MenuLogoSelect>(html`
      <my-menu-logo-select .items=${items} .selectedItems=${selectedItems}>
      </my-menu-logo-select>
    `);

    await expect(el).to.be.accessible();
  });
});
