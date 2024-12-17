import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LogoItem } from '../types/LogoItem';
import './Button';
import './MenuCategories';

@customElement('my-menu-logo-select-options')
export class MyMenuSelectOptions extends LitElement {
  @property({ type: Array }) items!: LogoItem[];
  @property({ type: Function }) onToggleItem!: (item: LogoItem) => void;
  @property({ type: Function }) onSelectAll!: () => void;
  @property({ type: Function }) onUnselectAll!: () => void;
  @property({ type: Function }) onSelectPreselected!: () => void;
  @property({ type: Function }) onSelectRandom!: () => void;

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
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      width: 100%;
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
          <my-button @click=${this.onSelectAll}>All</my-button>
          <my-button @click=${this.onUnselectAll}>None</my-button>
          <my-button @click=${this.onSelectPreselected}> Pre-Set </my-button>
          <my-button @click=${this.onSelectRandom}>Random</my-button>
          <my-menu-categories
            .items=${this.items}
            .onToggleItem=${this.onToggleItem.bind(this)}
          >
          </my-menu-categories>
        </div>
      </div>
    `;
  }
}
