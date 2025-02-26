import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MyElement } from 'types/MyElement';

@customElement('my-footer')
export class Footer extends MyElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  render() {
    return html`<slot name="content"></slot>`;
  }
}
