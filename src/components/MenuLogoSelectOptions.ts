import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './Button';

@customElement('my-menu-logo-select-options')
export class MyMenuSelectOptions extends LitElement {
  @property({ type: Function }) onSelectAll!: () => void;
  @property({ type: Function }) onUnselectAll!: () => void;
  @property({ type: Function }) onSelectPreselected!: () => void;
  @property({ type: Function }) onSelectRandom!: () => void;
  @property({ type: Function }) onRandomize!: () => void;
  @property({ type: Function }) onSort!: (order: 'asc' | 'desc') => void;

  static styles = css`
    :host {
      display: block;
    }

    .menu {
      display: flex;
      padding: var(--menu-padding, 16px) 0;
      color: var(--default-color-light);
      background: var(--default-background-light);
      border-bottom: 2px solid #d76d77;
    }

    @media (prefers-color-scheme: dark) {
      .menu {
        color: var(--default-color-dark);
        background: var(--default-background-dark);
      }
    }
    .container {
      display: flex;
      flex-wrap: no-wrap;
      white-space: nowrap;
      gap: var(--container-gap, 8px);
      width: 100%;
      overflow-x: auto;
    }
  `;

  render() {
    return html`
      <div class="menu">
        <div class="container">
          <my-button @click=${this.onSelectAll}>Select all</my-button>
          <my-button @click=${this.onUnselectAll}>Unselect all</my-button>
          <my-button @click=${this.onSelectPreselected}>
            Select preselected
          </my-button>
          <my-button @click=${this.onSelectRandom}>Select random</my-button>
          <my-button @click=${this.onRandomize}>Randomize order</my-button>
          <my-button @click=${() => this.onSort('asc')}>Sort A-Z</my-button>
          <my-button @click=${() => this.onSort('desc')}>Sort Z-A</my-button>
        </div>
      </div>
    `;
  }
}
