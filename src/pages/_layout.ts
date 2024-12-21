import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MyElement } from 'types/MyElement';
import 'components/Footer';
import 'components/Header';
import 'components/Notify';

@customElement('my-layout')
export class Layout extends MyElement {
  static styles = css`
    :host {
      --default-padding: 20px;
      --default-margin: 20px;
      --default-gap: 20px;
      --container-desktop-width: 1024px;

      display: block;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin: 0 auto;
      width: 100%;
      font-size: 0.8em;
    }
    @media (min-width: 1025px) {
      .container {
        gap: var(--default-gap) 0;
        max-width: var(--container-desktop-width);
        font-size: 1em;
      }
    }
    header,
    main,
    footer,
    aside,
    menu {
      margin: 0;
      padding: 0 var(--default-padding);
    }

    header ::slotted(*) {
      display: flex;
      flex-direction: column;
      gap: 0 var(--default-gap);
      margin-top: var(--default-margin);
    }

    footer ::slotted(*) {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-center;
      align-content: center;
      justify-content: center;
      gap: 0 var(--default-gap);
      margin-bottom: var(--default-margin);
    }
  `;

  render(): ReturnType<typeof html> {
    return html`
      <header>
        <div class="container">
          <my-header>
            <div slot="content">
              <slot name="header"></slot>
            </div>
          </my-header>
        </div>
      </header>
      <main>
        <slot name="main"></slot>
      </main>
      <footer>
        <div class="container">
          <my-footer>
            <div slot="content">
              <slot name="footer"></slot>
            </div>
          </my-footer>
        </div>
      </footer>
      <my-notify></my-notify>
    `;
  }
}
