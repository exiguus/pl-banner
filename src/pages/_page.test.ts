import { html, fixture, expect } from '@open-wc/testing';
import './_page'; // Import the Page component
import { Page } from './_page';

describe('Page Component', () => {
  it('should render correctly', async () => {
    const el = await fixture<Page>(html`<my-page></my-page>`);
    expect(el).to.exist;

    // Check if the slot for layout exists
    const slot = el.shadowRoot?.querySelector('slot[name="layout"]');
    expect(slot).to.exist;
  });

  it('should set default title and description', async () => {
    await fixture<Page>(html`<my-page></my-page>`);
    expect(document.title).to.equal('Default Page Title');

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).to.exist;
    expect(metaDescription?.getAttribute('content')).to.equal(
      'Default description for the page.'
    );
  });

  it('should update title and description when properties change', async () => {
    const el = await fixture<Page>(html`<my-page></my-page>`);

    el.title = 'New Page Title';
    el.description = 'Updated page description.';
    await el.updateComplete;

    expect(document.title).to.equal('New Page Title');

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).to.exist;
    expect(metaDescription?.getAttribute('content')).to.equal(
      'Updated page description.'
    );
  });

  it('should create meta description if it does not exist', async () => {
    // Remove meta description for this test
    const existingMetaDescription = document.querySelector(
      'meta[name="description"]'
    );
    existingMetaDescription?.remove();

    const el = await fixture<Page>(html`<my-page></my-page>`);
    await el.updateComplete;

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).to.exist;
    expect(metaDescription?.getAttribute('content')).to.equal(
      'Default description for the page.'
    );
  });

  it('should correctly set custom properties for light mode', async () => {
    const el = await fixture<Page>(html`<my-page></my-page>`);

    el.style.setProperty('--default-color-light', '#333');
    el.style.setProperty('--default-background-light', '#f0f0f0');
    el.style.setProperty('color', 'var(--default-color-light)');
    el.style.setProperty('background-color', 'var(--default-background-light)');

    const computedStyle = getComputedStyle(el);

    expect(
      computedStyle.getPropertyValue('--default-color-light').trim()
    ).to.equal('#333');
    expect(
      computedStyle.getPropertyValue('--default-background-light').trim()
    ).to.equal('#f0f0f0');
  });

  it('should be accessible', async () => {
    const el = await fixture<Page>(html`<my-page></my-page>`);
    await expect(el).to.be.accessible();
  });
});
