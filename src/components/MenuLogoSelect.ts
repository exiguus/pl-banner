import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LogoItem } from '../types/LogoItem';
import { filterPreselected } from '../utils/preselectedSvgs';
import './MenuLogoSelectItem';
import './MenuLogoSelectOptions';

@customElement('my-menu-logo-select')
export class MenuSelect extends LitElement {
  @property({ type: Array }) items: LogoItem[] = [];
  @property({ type: Array }) selectedItems: LogoItem[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this.initializeSelectedItems();
  }

  private dispatchSelectionChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('selection-changed', {
        detail: { selectedItems: this.selectedItems },
        bubbles: true,
        composed: true,
      })
    );
  }

  private initializeSelectedItems(): void {
    if (this.selectedItems.length === 0) {
      this.selectedItems = [...this.items];
    }
  }

  private onToggleItem(item: LogoItem): void {
    const isSelected = this.selectedItems.some((i) => i.id === item.id);
    this.selectedItems = isSelected
      ? this.selectedItems.filter((i) => i.id !== item.id)
      : [...this.selectedItems, item];
    this.dispatchSelectionChangeEvent();
  }

  private unselectAllItems(): void {
    this.selectedItems = [];
    this.dispatchSelectionChangeEvent();
  }

  private selectAllItems(): void {
    this.selectedItems = [...this.items];
    this.dispatchSelectionChangeEvent();
  }

  private selectPreselectedItems(): void {
    this.selectedItems = filterPreselected(this.items);
    this.dispatchSelectionChangeEvent();
  }

  private selectRandom(): void {
    this.selectedItems = this.items
      .sort(() => 0.5 - Math.random())
      .slice(0, 114);
    this.dispatchSelectionChangeEvent();
  }

  static styles = css`
    :host {
      display: block;
    }
    .container-select {
      opacity: 0;
      animation: fadeIn 0.3s 1.5s forwards;
      will-change: opacity;
    }

    .container-fluid {
      position: sticky;
      top: 530px;
      z-index: 1;
    }

    .container {
      background: var(--default-background-light);
    }

    @media (prefers-color-scheme: dark) {
      .container-select {
        background: var(--default-background-dark);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

  render() {
    return html`
    <div class="container-select">
      <h2>Select logos</h2>
      <p>Select the logos you want to include in the banner and determine the order.</p>
      <div class="container-fluid">
        <div class="container">
          <my-menu-logo-select-options
            .items=${this.items}
            .onToggleItem=${this.onToggleItem.bind(this)}
            .onSelectAll=${this.selectAllItems.bind(this)}
            .onUnselectAll=${this.unselectAllItems.bind(this)}
            .onSelectPreselected=${this.selectPreselectedItems.bind(this)}
            .onSelectRandom=${this.selectRandom.bind(this)}
          ></my-menu-select-options>
        </div>
      </div>
      <my-menu-logo-select-item
        .items=${this.items}
        .selectedItems=${this.selectedItems}
        .onToggleItem=${this.onToggleItem.bind(this)}
      ></my-menu-logo-select-item>
    `;
  }
}
