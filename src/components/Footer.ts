import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MyElement } from 'types/MyElement';

@customElement('my-footer')
export class Footer extends MyElement {
  connectedCallback(): void {
    super.connectedCallback();
  }

  render(): ReturnType<typeof html> {
    return html` <slot name="content"></slot> `;
  }
}
