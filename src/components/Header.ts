import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-header')
export class Header extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<slot name="content"></slot>`;
  }
}
