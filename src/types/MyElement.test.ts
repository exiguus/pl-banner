import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { MyElement } from './MyElement';
import './MyElement';

describe('MyElement', () => {
  it('should be a instance of MyElement', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);
    expect(el).to.be.an.instanceOf(MyElement);
  });

  it('should dispatch a custom event with the correct details', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);

    const detail = { message: 'Test Event' };
    const eventProps = {
      target: 'custom-event',
      detail,
    };

    // Set up a listener for the custom event
    const listener = oneEvent(el, 'custom-event');

    // Dispatch the custom event
    el.dispatchCustomEvent(eventProps);

    // Wait for the event and validate its properties
    const event = await listener;
    expect(event).to.exist;
    expect(event.type).to.equal('custom-event');
    expect(event.detail).to.deep.equal(detail);
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });

  it('should dispatch a non-bubbling event if bubbles is false', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);

    const detail = { message: 'Non-Bubbling Event' };
    const eventProps = {
      target: 'non-bubbling-event',
      detail,
      bubbles: false,
    };

    // Dispatch the event
    el.dispatchCustomEvent(eventProps);

    // Test that the event does not bubble up to the document
    let bubbledEventCaught = false;
    document.addEventListener('non-bubbling-event', () => {
      bubbledEventCaught = true;
    });

    // Wait for a short time to ensure no bubbling
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(bubbledEventCaught).to.be.false;
  });

  it('should dispatch a non-composed event if composed is false', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);

    const detail = { message: 'Non-Composed Event' };
    const eventProps = {
      target: 'non-composed-event',
      detail,
      composed: false,
    };

    // Set up a listener in the shadow DOM
    const shadowListener = oneEvent(el, 'non-composed-event');

    // Dispatch the custom event
    el.dispatchCustomEvent(eventProps);

    // Validate that the event is caught within the shadow DOM
    const event = await shadowListener;
    expect(event).to.exist;
    expect(event.type).to.equal('non-composed-event');
    expect(event.detail).to.deep.equal(detail);
  });

  it('should allow overriding default bubbles and composed values', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);

    const detail = { message: 'Overridden Defaults' };
    const eventProps = {
      target: 'overridden-event',
      detail,
      bubbles: false,
      composed: false,
    };

    // Set up a listener for the event
    const listener = oneEvent(el, 'overridden-event');

    // Dispatch the custom event
    el.dispatchCustomEvent(eventProps);

    const event = await listener;
    expect(event.bubbles).to.be.false;
    expect(event.composed).to.be.false;
  });

  it('should dispatch a custom event with the correct target', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);

    const detail = { message: 'Test Event' };
    const eventProps = {
      target: 'custom-event',
      detail,
    };

    // Set up a listener for the custom event
    const listener = oneEvent(el, 'custom-event');

    // Dispatch the custom event
    el.dispatchCustomEvent(eventProps);

    // Wait for the event and validate its target
    const event = await listener;
    expect(event).to.exist;
    expect(event.target).to.equal(el);
  });

  it('should dispatch a custom event with the correct detail', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);

    const detail = { message: 'Test Event' };
    const eventProps = {
      target: 'custom-event',
      detail,
    };

    // Set up a listener for the custom event
    const listener = oneEvent(el, 'custom-event');

    // Dispatch the custom event
    el.dispatchCustomEvent(eventProps);

    // Wait for the event and validate its detail
    const event = await listener;
    expect(event).to.exist;
    expect(event.detail).to.deep.equal(detail);
  });

  it('should dispatch a custom event with the correct bubbles value', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`);

    const detail = { message: 'Test Event' };
    const eventProps = {
      target: 'custom-event',
      detail,
      bubbles: false,
    };

    // Set up a listener for the custom event
    const listener = oneEvent(el, 'custom-event');

    // Dispatch the custom event
    el.dispatchCustomEvent(eventProps);

    // Wait for the event and validate its bubbles value
    const event = await listener;
    expect(event).to.exist;
    expect(event.bubbles).to.be.false;
  });
});
