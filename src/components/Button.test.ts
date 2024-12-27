import { html, fixture, expect } from '@open-wc/testing';
import './Button';
import sinon from 'sinon';

describe('Button Component', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    el = await fixture(html`<my-button>Click Me!</my-button>`);
  });

  it('should render correctly', () => {
    expect(el).to.exist;
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('button')).to.exist;
  });

  it('should display the correct textContent', async () => {
    const textContent = 'Test Button';
    el = await fixture(html`<my-button>${textContent}</my-button>`);
    const button = el.shadowRoot?.querySelector('button');
    const slot = button?.querySelector('slot');
    const slotContent = slot?.assignedNodes({ flatten: true });

    expect(slot).to.exist;
    expect(slotContent?.length).to.equal(1);
    expect(slotContent?.[0].textContent).to.equal(textContent);
  });

  it('should have a default variant', () => {
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('button')).to.be.true;
  });

  it('should have a custom variant', async () => {
    el = await fixture(
      html`<my-button variant="button primary">Click Me!</my-button>`
    );
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('primary')).to.be.true;
    expect(button?.classList.contains('button')).to.be.true;
  });

  it('should have a title attribute', async () => {
    el = await fixture(
      html`<my-button title="Test Button">Click Me!</my-button>`
    );
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.title).to.equal('Test Button');
  });

  it('should have a loading spinner', async () => {
    el = await fixture(
      html`<my-button .isLoading=${true}>Loading...</my-button>`
    );
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.querySelector('my-loading-spinner')).to.exist;
  });

  it('should be selected', async () => {
    el = await fixture(
      html`<my-button selected="selected">Click Me!</my-button>`
    );
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.classList.contains('selected')).to.be.true;
  });

  it('should be disabled', async () => {
    el = await fixture(
      html`<my-button disabled="disabled">Click Me!</my-button>`
    );
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.hasAttribute('disabled')).to.be.true;

    const spy = sinon.spy();
    el.addEventListener('click', spy);
    button?.click();
    expect(spy).to.not.have.been.called;
  });

  it('should fire a click event', async () => {
    const button = el.shadowRoot?.querySelector('button');
    setTimeout(() => button?.click());
    const { detail } = await new Promise<CustomEvent>((resolve) => {
      el.addEventListener(
        'click',
        (e) => resolve(e as unknown as CustomEvent),
        { once: true }
      );
    });
    expect(detail).to.exist;
  });

  it('should be accessible', async () => {
    await expect(el).to.be.accessible();
  });
});
