import { html, fixture, expect } from '@open-wc/testing';
import './_layout'; // Ensure the correct path to the Layout component

describe('Layout Component', () => {
  it('should render correctly', async () => {
    const el = await fixture(html`<my-layout></my-layout>`);
    expect(el).to.exist;

    // Check if header, main, footer, and notify exist
    const header = el.shadowRoot?.querySelector('header');
    const main = el.shadowRoot?.querySelector('main');
    const footer = el.shadowRoot?.querySelector('footer');
    const notify = el.shadowRoot?.querySelector('my-notify');

    expect(header).to.exist;
    expect(main).to.exist;
    expect(footer).to.exist;
    expect(notify).to.exist;
  });

  it('should render slotted header content', async () => {
    const el = await fixture(html`
      <my-layout>
        <div slot="header">Header Content</div>
      </my-layout>
    `);

    const headerSlot = el.shadowRoot?.querySelector(
      'header slot[name="header"]'
    );
    expect(headerSlot).to.exist;

    const assignedNodes = (headerSlot as HTMLSlotElement)?.assignedNodes({
      flatten: true,
    });
    expect(assignedNodes.length).to.equal(1);

    const content = assignedNodes[0] as HTMLElement;
    expect(content.textContent).to.equal('Header Content');
  });

  it('should render slotted main content', async () => {
    const el = await fixture(html`
      <my-layout>
        <div slot="main">Main Content</div>
      </my-layout>
    `);

    const mainSlot = el.shadowRoot?.querySelector('main slot[name="main"]');
    expect(mainSlot).to.exist;

    const assignedNodes = (mainSlot as HTMLSlotElement)?.assignedNodes({
      flatten: true,
    });
    expect(assignedNodes.length).to.equal(1);

    const content = assignedNodes[0] as HTMLElement;
    expect(content.textContent).to.equal('Main Content');
  });

  it('should render slotted footer content', async () => {
    const el = await fixture(html`
      <my-layout>
        <div slot="footer">Footer Content</div>
      </my-layout>
    `);

    const footerSlot = el.shadowRoot?.querySelector(
      'footer slot[name="footer"]'
    );
    expect(footerSlot).to.exist;

    const assignedNodes = (footerSlot as HTMLSlotElement)?.assignedNodes({
      flatten: true,
    });
    expect(assignedNodes.length).to.equal(1);

    const content = assignedNodes[0] as HTMLElement;
    expect(content.textContent).to.equal('Footer Content');
  });

  it('should render a notify component', async () => {
    const el = await fixture(html`<my-layout></my-layout>`);

    const notify = el.shadowRoot?.querySelector('my-notify');
    expect(notify).to.exist;
  });

  it('should be accessible', async () => {
    const el = await fixture(html`
      <my-layout>
        <div slot="header">Header Content</div>
        <div slot="main">Main Content</div>
        <div slot="footer">Footer Content</div>
      </my-layout>
    `);

    await expect(el).to.be.accessible();
  });
});
