import { html, fixture, expect } from '@open-wc/testing';
import './SVGInjector';
import type { SvgInjector } from './SVGInjector';

describe('SvgInjector Component', () => {
  it('should render correctly', async () => {
    const el = await fixture<SvgInjector>(
      html`<my-svg-injector></my-svg-injector>`
    );
    expect(el).to.exist;
    expect(el.shadowRoot).to.exist;
    const container = el.shadowRoot?.querySelector('.svg-container');
    expect(container).to.exist;
    expect(container?.innerHTML).to.equal('');
  });

  it('should inject valid SVG content', async () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>`;
    const el = await fixture<SvgInjector>(
      html`<my-svg-injector .svgContent=${svgContent}></my-svg-injector>`
    );
    const container = el.shadowRoot?.querySelector('.svg-container');
    await el.updateComplete;
    expect(container?.innerHTML).to.include('<svg');
    expect(container?.innerHTML).to.include('viewBox="0 0 100 100"');
    expect(container?.innerHTML).to.include('<circle cx="50" cy="50" r="40"');
  });

  it('should clear invalid SVG content', async () => {
    const invalidSvgContent = '<div>Not an SVG</div>';
    const el = await fixture<SvgInjector>(
      html`<my-svg-injector .svgContent=${invalidSvgContent}></my-svg-injector>`
    );
    const container = el.shadowRoot?.querySelector('.svg-container');
    await el.updateComplete;
    expect(container?.innerHTML).to.equal('');
  });

  it('should clear the container if svgContent is empty', async () => {
    const el = await fixture<SvgInjector>(
      html`<my-svg-injector></my-svg-injector>`
    );
    el.svgContent = `<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" /></svg>`;
    await el.updateComplete;

    const container = el.shadowRoot?.querySelector('.svg-container');
    expect(container?.innerHTML).to.include('<svg');

    el.svgContent = '';
    await el.updateComplete;
    expect(container?.innerHTML).to.equal('');
  });

  it('should be accessible', async () => {
    const el = await fixture<SvgInjector>(
      html`<my-svg-injector></my-svg-injector>`
    );
    await expect(el).to.be.accessible();
  });
});
