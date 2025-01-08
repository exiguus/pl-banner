import { html, fixture, expect } from '@open-wc/testing';
import './Logo';
import type { Logo } from './Logo';
import type { LogoItem } from 'types/LogoItem';
import { Categories } from 'types/Categories';
import type { LitElement } from 'lit';

describe('Logo Component', () => {
  let el: Logo;
  const validLogoItem: LogoItem = {
    title: 'Test Logo',
    category: Categories.Framework,
    id: 'test-logo',
    description: 'A test logo description.',
    path: '',
    url: 'https://example.com',
    svgContent:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>',
  };

  it('should render correctly with no item', async () => {
    el = await fixture<Logo>(html`<my-logo></my-logo>`);
    expect(el).to.exist;
    expect(el.shadowRoot).to.exist;
    const logoContainer = el.shadowRoot?.querySelector('.logo');
    expect(logoContainer).to.not.exist;
  });

  it('should render correctly with a valid item', async () => {
    el = await fixture<Logo>(html`<my-logo .item=${validLogoItem}></my-logo>`);
    expect(el).to.exist;
    const logoContainer = el.shadowRoot?.querySelector('.logo');
    expect(logoContainer).to.exist;

    expect(logoContainer?.getAttribute('title')).to.include(
      validLogoItem.title
    );
    expect(logoContainer?.getAttribute('title')).to.include(
      validLogoItem.description
    );
    expect(logoContainer?.getAttribute('title')).to.include(validLogoItem.url);

    const svgInjector = logoContainer?.querySelector('my-svg-injector');
    if (svgInjector) {
      await (svgInjector as LitElement).updateComplete;
    } else {
      throw new Error('SVG Injector not found');
    }

    const svgContainer =
      svgInjector.shadowRoot?.querySelector('.svg-container');
    expect(svgContainer).to.exist;
    expect(svgContainer?.innerHTML).to.include('<svg');
    expect(svgContainer?.innerHTML).to.include(
      '<circle cx="50" cy="50" r="40"'
    );
  });

  it('should not render anything if item is null', async () => {
    el = await fixture<Logo>(html`<my-logo .item=${null}></my-logo>`);
    expect(el).to.exist;
    const logoContainer = el.shadowRoot?.querySelector('.logo');
    expect(logoContainer).to.not.exist;
  });

  it('should update correctly when item changes', async () => {
    el = await fixture<Logo>(html`<my-logo></my-logo>`);
    expect(el).to.exist;

    let logoContainer = el.shadowRoot?.querySelector('.logo');
    expect(logoContainer).to.not.exist;

    el.item = validLogoItem;
    await el.updateComplete;
    logoContainer = el.shadowRoot?.querySelector('.logo');
    expect(logoContainer).to.exist;
    expect(logoContainer?.getAttribute('title')).to.include(
      validLogoItem.title
    );

    el.item = null;
    await el.updateComplete;
    logoContainer = el.shadowRoot?.querySelector('.logo');
    expect(logoContainer).to.not.exist;
  });

  it('should be accessible', async () => {
    el = await fixture<Logo>(html`<my-logo .item=${validLogoItem}></my-logo>`);
    await expect(el).to.be.accessible();
  });
});
