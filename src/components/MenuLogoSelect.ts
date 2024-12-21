import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { LogoItem } from 'types/LogoItem';
import type { SelectionChangeEventDetail } from 'types/MyEvents';
import { filterPreselected } from 'utils/preselectedSvgs';
import { MyElement } from 'types/MyElement';
import 'components/MenuLogoSelectItem';
import 'components/MenuLogoSelectOptions';

@customElement('my-menu-logo-select')
export class MenuSelect extends MyElement {
  @property({ type: Array }) items!: LogoItem[];
  @property({ type: Array }) selectedItems!: LogoItem[];

  @state() private displayItems: LogoItem[] = [];

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

  connectedCallback(): void {
    super.connectedCallback();
    this.initializeDisplayItems();
    this.initializeSelectedItems();
  }

  private dispatchSelectionChangeEvent(): void {
    this.dispatchCustomEvent<SelectionChangeEventDetail>({
      target: 'selection-changed',
      detail: {
        selectedItems: this.selectedItems,
      },
    });
  }

  private initializeDisplayItems(): void {
    this.displayItems = this.items;
  }

  private initializeSelectedItems(): void {
    if (this.selectedItems.length === 0) {
      this.selectedItems = [...this.displayItems];
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
    this.selectedItems = [...this.displayItems];
    this.dispatchSelectionChangeEvent();
  }

  private selectPreselectedItems(): void {
    this.selectedItems = filterPreselected(this.displayItems);
    this.dispatchSelectionChangeEvent();
  }

  private selectRandom(): void {
    this.selectedItems = this.displayItems
      .sort(() => 0.5 - Math.random())
      .slice(0, this.displayItems.length / 2);
    this.dispatchSelectionChangeEvent();
  }

  private handleChangeDisplayItems(event: CustomEvent): void {
    const { displayItems } = event.detail;
    this.displayItems = displayItems;
  }

  render() {
    return html`
    <div class="container-select">
      <h2>Select logos</h2>
      <p>Select the logos you want to include in the banner and determine the order.</p>
      <div class="container-fluid">
        <div class="container">
          <my-menu-logo-select-options
            .items=${this.items}
            .displayItems=${this.displayItems}
            .onToggleItem=${this.onToggleItem.bind(this)}
            .onSelectAll=${this.selectAllItems.bind(this)}
            .onUnselectAll=${this.unselectAllItems.bind(this)}
            .onSelectPreselected=${this.selectPreselectedItems.bind(this)}
            .onSelectRandom=${this.selectRandom.bind(this)}
            @change-display-items=${this.handleChangeDisplayItems.bind(this)}
          ></my-menu-select-options>
        </div>
      </div>
      <my-menu-logo-select-item
        .items=${this.displayItems}
        .selectedItems=${this.selectedItems}
        .onToggleItem=${this.onToggleItem.bind(this)}
        @change-display-items=${this.handleChangeDisplayItems.bind(this)}
      ></my-menu-logo-select-item>
    `;
  }
}
