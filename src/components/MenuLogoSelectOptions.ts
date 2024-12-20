import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LogoItem } from '../types/LogoItem';
import './Button';
import './MenuCategories';
import './MenuSearch';

@customElement('my-menu-logo-select-options')
export class MyMenuSelectOptions extends LitElement {
  @property({ type: Array }) items!: LogoItem[];
  @property({ type: Array }) displayItems!: LogoItem[];
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
      align-items: center;
      gap: var(--container-gap, 8px);
      width: 100%;
      overflow-x: auto;
    }
    .button-group {
      display: flex;
      gap: var(--button-group-gap, 1px);
    }
  `;

  render() {
    return html`
      <div class="menu">
        <div class="container">
          <div class="button-group">
            <my-button variant="button left" @click=${this.onSelectAll}
              >Select All</my-button
            >
            <my-button variant="button center" @click=${this.onUnselectAll}
              >None</my-button
            >
            <my-button
              variant="button center"
              @click=${this.onSelectPreselected}
            >
              Pre-Set
            </my-button>
            <my-button variant="button right" @click=${this.onSelectRandom}
              >Random</my-button
            >
          </div>
          <my-menu-categories
            .items=${this.items}
            .onToggleItem=${this.onToggleItem.bind(this)}
          >
          </my-menu-categories>
          <my-menu-search
            .items=${this.items}
            .displayItems=${this.displayItems}
          ></my-menu-search>
        </div>
      </div>
    `;
  }
}
