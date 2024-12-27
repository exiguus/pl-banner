import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-footer')
export class Footer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<slot name="content"></slot>`;
  }
}
