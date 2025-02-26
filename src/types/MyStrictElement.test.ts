import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { vi } from 'vitest';
import { customElement } from 'lit/decorators.js';
import { MyStrictElement } from './MyStrictElement';

// Create a variable to hold the spy
let logSpy: sinon.SinonSpy;

// Mock the log module
vi.mock('utils/log', () => ({
  log: (...args: any[]) => logSpy(...args),
}));

describe('MyStrictElement', () => {
  beforeEach(() => {
    // Create a new spy for each test
    logSpy = sinon.spy();
  });

  it('should be an instance of MyStrictElement', async () => {
    const el = await fixture<MyStrictElement>(
      html`<my-strict-element></my-strict-element>`
    );
    expect(el).to.be.instanceOf(MyStrictElement);
  });

  it('should attach Shadow DOM correctly', async () => {
    const el = await fixture<MyStrictElement>(
      html`<my-strict-element></my-strict-element>`
    );
    expect(el.shadowRoot).to.not.be.null;
  });

  it('should enable warnings in development mode', async () => {
    process.env.NODE_ENV = 'development';
    await fixture<MyStrictElement>(
      html`<my-strict-element></my-strict-element>`
    );
    expect(MyStrictElement.enabledWarnings).to.deep.equal([
      'change-in-update',
      'migration',
      'async-perform-update',
    ]);
  });

  it('should disable warnings in production mode', async () => {
    const currentEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    await fixture<MyStrictElement>(
      html`<my-strict-element></my-strict-element>`
    );
    expect(MyStrictElement.enabledWarnings).to.deep.equal([]);
    process.env.NODE_ENV = currentEnv;
  });

  it('should log connection and disconnection', async () => {
    const el = await fixture<MyStrictElement>(
      html`<my-strict-element></my-strict-element>`
    );
    await el.updateComplete;

    expect(
      logSpy.calledWith({
        message: 'Connected: my-strict-element',
        type: 'info',
        env: 'development',
      })
    ).to.be.true;

    el.remove();
    await el.updateComplete;

    expect(
      logSpy.calledWith({
        message: 'Disconnected: my-strict-element',
        type: 'info',
        env: 'development',
      })
    ).to.be.true;

    expect(logSpy.callCount).to.equal(2);
  });

  describe('attribute warnings', () => {
    it('should warn about missing required attributes', async () => {
      @customElement('test-element-required')
      class TestElement extends MyStrictElement {
        static override get observedAttributes() {
          return ['!required-attr'];
        }
      }

      const el = await fixture<TestElement>(
        html`<test-element-required></test-element-required>`
      );
      await el.updateComplete;
      el.warnObservedAttributes();

      expect(
        logSpy.calledWith(
          sinon.match({
            message: sinon.match(/missing required attribute: !required-attr/),
            type: 'warn',
            env: 'all',
          })
        )
      ).to.be.true;
    });

    it('should warn about optional attributes only in debug mode', async () => {
      @customElement('test-element-optional')
      class TestElement extends MyStrictElement {
        static override get observedAttributes() {
          return ['optional-attr'];
        }
      }

      const el = await fixture<TestElement>(
        html`<test-element-optional></test-element-optional>`
      );
      await el.updateComplete;
      el.debug = true;
      el.warnObservedAttributes();

      expect(
        logSpy.calledWith(
          sinon.match({
            message: sinon.match(/missing attribute: optional-attr/),
            type: 'warn',
            env: 'all',
          })
        )
      ).to.be.true;
    });
  });

  describe('Shadow DOM warnings', () => {
    it('should log error if Shadow DOM is not supported', async () => {
      const el = await fixture<MyStrictElement>(
        html`<my-strict-element></my-strict-element>`
      );
      // Simulate lack of Shadow DOM support
      el.attachShadow = null as any;
      el.errorAttachShadow();

      expect(
        logSpy.calledWith({
          message: 'my-strict-element does not support Shadow DOM.',
          type: 'error',
          env: 'all',
        })
      ).to.be.true;
    });
  });

  describe('innerHTML warnings', () => {
    it('should warn when innerHTML is used', async () => {
      const el = await fixture<MyStrictElement>(
        html`<my-strict-element></my-strict-element>`
      );
      await el.updateComplete;

      // Clear previous log calls
      logSpy.resetHistory();

      // Get proxied element
      const proxiedEl = el.warnDeprecatedInnerHTML();
      proxiedEl.innerHTML = '<div>test</div>';

      expect(logSpy.calledOnce).to.be.true;
      expect(logSpy.firstCall.args[0]).to.deep.include({
        message:
          'my-strict-element: Avoid using innerHTML for setting content as it may lead to XSS vulnerabilities.',
        type: 'warn',
      });
    });
  });

  describe('debug mode', () => {
    it('should be enabled in development environment', async () => {
      process.env.NODE_ENV = 'development';
      const el = await fixture<MyStrictElement>(
        html`<my-strict-element></my-strict-element>`
      );
      expect(el.debug).to.be.true;
    });

    it('should be disabled in production environment', async () => {
      process.env.NODE_ENV = 'production';
      const el = await fixture<MyStrictElement>(
        html`<my-strict-element></my-strict-element>`
      );
      expect(el.debug).to.be.false;
    });
  });
});
