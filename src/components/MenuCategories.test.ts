import { html, fixture, expect } from '@open-wc/testing';
import './MenuCategories';
import { MenuCategories } from './MenuCategories';
import sinon from 'sinon';
import { Categories } from 'types/Categories';
import { LogoItem } from 'types/LogoItem';
import categories from '../data/categories.json';

describe('MenuCategories Component', () => {
  let el: MenuCategories;
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
  const onToggleItem = sinon.spy();

  beforeEach(async () => {
    el = await fixture<MenuCategories>(html`
      <my-menu-categories
        .items=${items}
        .onToggleItem=${onToggleItem}
      ></my-menu-categories>
    `);

    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should render correctly', () => {
    expect(el.shadowRoot?.querySelector('.menu')).to.exist;
    expect(el.shadowRoot?.querySelector('details')).to.exist;
    expect(el.shadowRoot?.querySelector('summary')).to.exist;
    expect(el.shadowRoot?.querySelector('select')).to.exist;
  });

  it('should render a list of select options', () => {
    expect(el.shadowRoot?.querySelector('select')).to.exist;
    expect(el.shadowRoot?.querySelectorAll('select option').length).to.equal(
      categories.length
    );
  });

  it('should render all options selected', () => {
    const selectElement = el.shadowRoot?.querySelector('select');
    expect(selectElement?.selectedOptions.length).to.equal(categories.length);
  });

  it('should render selected options', () => {
    const selectElement = el.shadowRoot?.querySelector('select');
    expect(selectElement?.selectedOptions.length).to.equal(categories.length);
  });

  it('should select options', () => {
    const selectElement = el.shadowRoot?.querySelector('select');
    selectElement?.querySelectorAll('option').forEach((option) => {
      option.selected = false;
    });
    expect(selectElement?.selectedOptions.length).to.equal(0);

    if (selectElement) {
      const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true,
      });
      selectElement.querySelectorAll('option')[0].selected = true;
      selectElement.dispatchEvent(changeEvent);
    } else {
      expect.fail('No select element found');
    }

    expect(selectElement?.selectedOptions.length).to.equal(1);
  });
});
