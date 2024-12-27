import { html, fixture, expect } from '@open-wc/testing';
import './Footer';

describe('Footer Component', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    el = await fixture(html`<my-footer></my-footer>`);
  });

  it('should render without content', () => {
    expect(el).to.exist;

    const slot = el.shadowRoot?.querySelector(
      'slot[name="content"]'
    ) as HTMLSlotElement;
    expect(slot).to.exist;
    const assignedNodes = slot?.assignedNodes();
    expect(assignedNodes?.length).to.equal(0);
  });

  it('should render content inside the slot', async () => {
    el = await fixture(html`
      <my-footer>
        <div slot="content">Footer Content</div>
      </my-footer>
    `);

    const slot = el.shadowRoot?.querySelector(
      'slot[name="content"]'
    ) as HTMLSlotElement;
    expect(slot).to.exist;

    const assignedNodes = slot?.assignedNodes({ flatten: true });
    expect(assignedNodes).to.exist;
    expect(assignedNodes?.length).to.be.greaterThan(0);

    const slottedContent = assignedNodes?.[0] as HTMLElement;
    expect(slottedContent).to.exist;
    expect(slottedContent.textContent).to.equal('Footer Content');
  });

  it('should be accessible', async () => {
    await expect(el).to.be.accessible();
  });

  it('should render multiple slotted elements', async () => {
    el = await fixture(html`
      <my-footer>
        <span slot="content">Item 1</span>
        <span slot="content">Item 2</span>
      </my-footer>
    `);

    const slot = el.shadowRoot?.querySelector(
      'slot[name="content"]'
    ) as HTMLSlotElement;
    expect(slot).to.exist;

    const assignedNodes = slot?.assignedNodes({ flatten: true });
    expect(assignedNodes).to.exist;
    expect(assignedNodes?.length).to.equal(2);

    const slottedContent1 = assignedNodes?.[0] as HTMLElement;
    const slottedContent2 = assignedNodes?.[1] as HTMLElement;

    expect(slottedContent1).to.exist;
    expect(slottedContent1.textContent).to.equal('Item 1');

    expect(slottedContent2).to.exist;
    expect(slottedContent2.textContent).to.equal('Item 2');
  });
});
