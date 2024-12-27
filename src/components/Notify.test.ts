import { html, fixture, expect } from '@open-wc/testing';
import './Notify';
import { Notify } from './Notify';

describe('Notify Component', () => {
  it('should render correctly when no notification is present', async () => {
    const el = await fixture(html`<my-notify></my-notify>`);
    expect(el).to.exist; // Check the component exists
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('.notify')).to.not.exist; // No notification rendered
  });

  it('should render a notification', async () => {
    const testMessage = 'Test notification message';
    const el = await fixture<Notify>(html`<my-notify></my-notify>`);

    // Create and dispatch the custom event
    const notifyEvent = new CustomEvent('notify', {
      detail: {
        message: testMessage,
        duration: 3000,
        type: 'info',
      },
      bubbles: true,
      composed: true,
    });

    // Dispatch the event on the window
    el.dispatchEvent(notifyEvent);
    // Wait for updates to propagate
    await new Promise((r) => setTimeout(r, 300));

    // Assert that the event was handled
    const notification = el.shadowRoot?.querySelector('.notify');
    expect(notification).to.exist;
    expect(notification?.textContent?.trim()).to.be.equal(testMessage);
  });

  it('should render a notification with a custom type', async () => {
    const testMessage = 'Test notification message';
    const el = await fixture<Notify>(html`<my-notify></my-notify>`);

    // Create and dispatch the custom event
    const notifyEvent = new CustomEvent('notify', {
      detail: {
        message: testMessage,
        duration: 3000,
        type: 'error',
      },
      bubbles: true,
      composed: true,
    });

    // Dispatch the event on the window
    el.dispatchEvent(notifyEvent);
    // Wait for updates to propagate
    await new Promise((r) => setTimeout(r, 300));

    // Assert that the event was handled
    const notification = el.shadowRoot?.querySelector('.notify .container');
    expect(notification).to.exist;
    expect(notification?.classList.contains('error')).to.be.true;
  });

  it('should render a notification with a custom duration', async () => {
    const testMessage = 'Test notification message';
    const el = await fixture<Notify>(html`<my-notify></my-notify>`);

    // Create and dispatch the custom event
    const notifyEvent = new CustomEvent('notify', {
      detail: {
        message: testMessage,
        duration: 1000,
        type: 'success',
      },
      bubbles: true,
      composed: true,
    });

    // Dispatch the event on the window
    el.dispatchEvent(notifyEvent);
    // Wait for updates to propagate
    await new Promise((r) => setTimeout(r, 300));

    // Assert that the event was handled
    const notification = el.shadowRoot?.querySelector('.notify');
    expect(notification).to.exist;
    expect(notification?.textContent?.trim()).to.be.equal(testMessage);

    // Wait for the notification to disappear
    await new Promise((r) => setTimeout(r, 1000));

    // Assert that the notification has disappeared
    expect(el.shadowRoot?.querySelector('.notify')).to.not.exist;
  });
});
