import { LitElement, WarningKind } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { log } from 'utils/log';

@customElement('my-strict-element')
export class MyStrictElement extends LitElement {
  @property({ type: Boolean }) debug = process.env.NODE_ENV === 'development';
  static enabledWarnings: WarningKind[] = [];

  connectedCallback(): void {
    super.connectedCallback();

    if (this.debug) {
      MyStrictElement.enabledWarnings = [
        'change-in-update',
        'migration',
        'async-perform-update',
      ];
    } else {
      MyStrictElement.enabledWarnings = [];
    }

    log({
      message: `Connected: ${this.tagName.toLocaleLowerCase()}`,
      type: 'info',
      env: 'development',
    });

    this.errorAttachShadow();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    log({
      message: `Disconnected: ${this.tagName.toLocaleLowerCase()}`,
      type: 'info',
      env: 'development',
    });
  }

  // Ensure Shadow DOM is attached correctly
  errorAttachShadow() {
    if (!this.attachShadow) {
      log({
        message: `${this.tagName.toLowerCase()} does not support Shadow DOM.`,
        type: 'error',
        env: 'all',
      });
    }
  }
  // Check if observedAttributes is implemented
  warnObservedAttributes() {
    if ((this.constructor as typeof LitElement).observedAttributes) {
      const attributes = (this.constructor as typeof LitElement)
        .observedAttributes;
      for (const attr of attributes) {
        // Check if the attribute is required
        if (attr.startsWith('!')) {
          if (!this.hasAttribute(attr.slice(1))) {
            log({
              message: `${this.tagName.toLowerCase()} is missing required attribute: ${attr} `,
              type: 'warn',
              env: 'all',
            });
          }
        } else {
          if (!this.debug) return;
          if (!this.hasAttribute(attr)) {
            log({
              message: `${this.tagName.toLowerCase()} is missing attribute: ${attr} `,
              type: 'warn',
              env: 'all',
            });
          }
        }
      }
    }
  }
  warnDeprecatedInnerHTML() {
    const tagName = this.tagName.toLowerCase();
    const handler = {
      set(target: HTMLElement, prop: string, value: string) {
        if (prop === 'innerHTML') {
          log({
            message: `${tagName}: Avoid using innerHTML for setting content as it may lead to XSS vulnerabilities.`,
            type: 'warn',
          });
        }
        return Reflect.set(target, prop, value);
      },
    };

    Object.preventExtensions(this);
    return new Proxy(this, handler);
  }
}
