import { html, fixture, expect } from '@open-wc/testing';
import './LoadingSpinner';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  let el: LoadingSpinner;

  beforeEach(async () => {
    el = await fixture<LoadingSpinner>(
      html`<my-loading-spinner></my-loading-spinner>`
    );
  });

  it('should render correctly', () => {
    expect(el).to.exist;

    const container = el.shadowRoot?.querySelector('.container');
    expect(container).to.exist;
    expect(container?.getAttribute('role')).to.equal('status');
    expect(container?.getAttribute('aria-live')).to.equal('polite');

    const spinner = container?.querySelector('.spinner');
    expect(spinner).to.exist;

    const srOnlyText = container?.querySelector('.sr-only');
    expect(srOnlyText).to.exist;
    expect(srOnlyText?.textContent).to.equal('Loading...');
  });

  it('should be accessible', async () => {
    await expect(el).to.be.accessible();
  });
});
