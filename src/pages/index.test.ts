import { html, fixture, expect } from '@open-wc/testing';
import './index';
import type { Index } from './index';

describe('Index Component', () => {
  it('should render header slot with dynamic content', async () => {
    const el = await fixture<Index>(html`
      <my-index
        title="Test Title"
        description="Test Description"
        disclaimer="Test Disclaimer"
      ></my-index>
    `);

    // Simulate the loading state completion
    el['isLoading'] = false; // Avoid direct use of private properties in practice; replace with a public method if available
    await el.updateComplete;

    const layout = el.shadowRoot?.querySelector('my-layout');
    const headerSlot = layout?.shadowRoot?.querySelector(
      'slot[name="header"]'
    ) as HTMLSlotElement;

    expect(headerSlot).to.exist;

    const assignedNodes = headerSlot.assignedNodes({ flatten: true });
    expect(assignedNodes.length).to.be.greaterThan(0);

    const headerContainer = assignedNodes[0] as HTMLElement;

    const title = headerContainer.querySelector('h1');
    const disclaimer = headerContainer.querySelector('.disclaimer');

    expect(title?.textContent).to.include('Test Title');
    expect(disclaimer?.textContent).to.equal('Test Disclaimer');
  });

  it('should render main slot with dynamic content', async () => {
    const el = await fixture<Index>(html` <my-index></my-index> `);

    // Simulate the loading state completion
    el['isLoading'] = false;
    await el.updateComplete;

    const layout = el.shadowRoot?.querySelector('my-layout');
    const mainSlot = layout?.shadowRoot?.querySelector(
      'slot[name="main"]'
    ) as HTMLSlotElement;

    expect(mainSlot).to.exist;

    const assignedNodes = mainSlot.assignedNodes({ flatten: true });
    expect(assignedNodes.length).to.be.greaterThan(0);

    const mainContainer = assignedNodes[0] as HTMLElement;

    const homeComponent = mainContainer.querySelector('my-home');
    expect(homeComponent).to.exist;
  });

  it('should render footer slot with dynamic content', async () => {
    const el = await fixture<Index>(html`
      <my-index
        title="Footer Title"
        description="Footer Description"
        disclaimer="Footer Disclaimer"
      ></my-index>
    `);

    const layout = el.shadowRoot?.querySelector('my-layout');
    const footerSlot = layout?.shadowRoot?.querySelector(
      'slot[name="footer"]'
    ) as HTMLSlotElement;

    expect(footerSlot).to.exist;

    const assignedNodes = footerSlot.assignedNodes({ flatten: true });
    expect(assignedNodes.length).to.be.greaterThan(0);

    const footerContainer = assignedNodes[0] as HTMLElement;

    expect(footerContainer.textContent).to.include('Footer Title');
    expect(footerContainer.textContent).to.include('Footer Description');
    expect(footerContainer.textContent).to.include('Footer Disclaimer');
  });
});
