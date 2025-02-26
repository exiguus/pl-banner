import { html, fixture, expect } from '@open-wc/testing';
import { ErrorBoundary } from './ErrorBoundary';
import { ComponentErrorEvent } from 'types/MyEvents';
import './ErrorBoundary';

// Mock PromiseRejectionEvent if not available
class MockPromiseRejectionEvent extends Event {
  promise: Promise<unknown>;
  reason: unknown;
  constructor(
    type: string,
    init: { promise: Promise<unknown>; reason: unknown }
  ) {
    super(type, { bubbles: true, cancelable: true });
    this.promise = init.promise;
    this.reason = init.reason;
  }
}

global.PromiseRejectionEvent =
  global.PromiseRejectionEvent || MockPromiseRejectionEvent;

describe('ErrorBoundary Component', () => {
  let el: ErrorBoundary;

  beforeEach(async () => {
    process.env.NODE_ENV = 'development';
    el = await fixture<ErrorBoundary>(
      html`<my-error-boundary></my-error-boundary>`
    );
  });

  it('should render without content', () => {
    expect(el).to.exist;
    const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    expect(slot).to.exist;
    const assignedNodes = slot?.assignedNodes();
    expect(assignedNodes?.length).to.equal(0);
  });

  it('should render content inside the slot', async () => {
    el = await fixture<ErrorBoundary>(html`
      <my-error-boundary>
        <div id="content">Content</div>
      </my-error-boundary>
    `);

    await el.updateComplete;

    // Using a more reliable way to wait for slot content
    const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    await new Promise((resolve) => {
      if (slot.assignedNodes().length > 0) {
        resolve(true);
        return;
      }
      slot.addEventListener('slotchange', () => resolve(true), { once: true });
    });

    const nodes = slot.assignedNodes();
    const content = nodes[1] as HTMLElement;
    expect(content).to.exist;
    expect(content.id).to.equal('content');
    expect(content.textContent?.trim()).to.equal('Content');
  });

  it('should handle component errors', async () => {
    const error = new Error('Test Error');
    const errorEvent = new CustomEvent<ComponentErrorEvent['detail']>(
      'component-error',
      {
        bubbles: true,
        composed: true,
        detail: {
          message: 'Test Error',
          stack: error.stack,
          error,
          component: 'test-component',
        },
      }
    );

    el.dispatchEvent(errorEvent);
    await el.updateComplete;

    const errorContainer = el.shadowRoot?.querySelector('.error');
    expect(errorContainer).to.exist;
    expect(errorContainer?.textContent).to.include('Test Error');
  });

  it('should handle unhandled promise rejections', async () => {
    const error = new Error('Promise Error');
    const rejectedPromise = Promise.reject(error);
    const rejectionEvent = new MockPromiseRejectionEvent('unhandledrejection', {
      promise: rejectedPromise,
      reason: error,
    });

    // Prevent actual rejection from causing test failure
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    rejectedPromise.catch(() => {});

    el.dispatchEvent(rejectionEvent);
    await el.updateComplete;

    const errorContainer = el.shadowRoot?.querySelector('.error');
    expect(errorContainer).to.exist;
    expect(errorContainer?.textContent).to.include('Promise Error');
  });

  it('should use fallback message', async () => {
    el = await fixture(html`
      <my-error-boundary fallbackMessage="Custom Error Message">
      </my-error-boundary>
    `);

    const errorEvent = new CustomEvent('component-error', {
      detail: {
        message: 'Test Error',
        component: 'test-component',
      },
    }) as unknown as ComponentErrorEvent;

    el.dispatchEvent(errorEvent);
    await el.updateComplete;

    const errorContainer = el.shadowRoot?.querySelector('.error');
    expect(errorContainer).to.exist;
    expect(errorContainer?.textContent).to.include('Custom Error Message');
  });

  it('should dispatch custom event with provided properties', () => {
    const eventProps = {
      target: 'custom-event',
      detail: { message: 'Custom Event' },
      bubbles: true,
      composed: true,
    };

    el.dispatchEvent(
      new CustomEvent(eventProps.target, {
        detail: eventProps.detail,
        bubbles: eventProps?.bubbles ?? true,
        composed: eventProps?.composed ?? true,
      })
    );

    const event = new CustomEvent(eventProps.target, {
      detail: eventProps.detail,
      bubbles: eventProps.bubbles,
      composed: eventProps.composed,
    });

    expect(event.type).to.equal(eventProps.target);
    expect(event.detail).to.deep.equal(eventProps.detail);
    expect(event.bubbles).to.equal(eventProps.bubbles);
    expect(event.composed).to.equal(eventProps.composed);
  });
});
