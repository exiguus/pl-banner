import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-footer')
export class Footer extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();
  }

  render(): ReturnType<typeof html> {
    return html` <slot name="content"></slot> `;
  }
}
