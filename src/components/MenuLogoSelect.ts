import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import preselectedItems from '../../src/assets/names-preselect.json';
import './MenuLogoSelectIcon';
import './MenuLogoSelectOptions';

interface Icon {
  name: string;
  path: string;
}

@customElement('my-menu-logo-select')
export class MenuSelect extends LitElement {
  @property({ type: Array }) icons: Icon[] = [];
  @property({ type: Array }) selectedIcons: Icon[] = [];
  @property({ type: Function }) onRandomize!: () => void;
  @property({ type: Function }) onSort!: (order: 'asc' | 'desc') => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.initializeSelectedIcons();
  }

  private dispatchSelectionChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('selection-changed', {
        detail: { selectedIcons: this.selectedIcons },
        bubbles: true,
        composed: true,
      })
    );
  }

  private initializeSelectedIcons(): void {
    if (this.selectedIcons.length === 0) {
      this.selectedIcons = [...this.icons];
    }
  }

  private onToggleIcon(icon: Icon): void {
    const isSelected = this.selectedIcons.some(
      (item) => item.name === icon.name
    );
    this.selectedIcons = isSelected
      ? this.selectedIcons.filter((item) => item.name !== icon.name)
      : [...this.selectedIcons, icon];
    this.dispatchSelectionChangeEvent();
  }

  private unselectAllIcons(): void {
    this.selectedIcons = [];
    this.dispatchSelectionChangeEvent();
  }

  private selectAllIcons(): void {
    this.selectedIcons = [...this.icons];
    this.dispatchSelectionChangeEvent();
  }

  private selectPreselectedIcons(): void {
    this.selectedIcons = this.icons.filter((icon) =>
      preselectedItems.includes(icon.name)
    );
    this.dispatchSelectionChangeEvent();
  }

  private selectRandomIcons(): void {
    // select 6x20 icons
    const randomIcons = this.icons
      .sort(() => Math.random() - 0.5)
      .slice(0, 120);
    this.selectedIcons = randomIcons;
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
          .onSelectAll=${this.selectAllIcons.bind(this)}
          .onUnselectAll=${this.unselectAllIcons.bind(this)}
          .onSelectPreselected=${this.selectPreselectedIcons.bind(this)}
          .onSelectRandom=${this.selectRandomIcons.bind(this)}
          .onRandomize=${this.onRandomize.bind(this)}
          .onSort=${this.onSort.bind(this)}
        ></my-menu-select-options>
        </div>
      </div>
      <my-menu-logo-select-icons
        .icons=${this.icons}
        .selectedIcons=${this.selectedIcons}
        .onToggleIcon=${this.onToggleIcon.bind(this)}
      ></my-menu-logo-select-icons>
    `;
  }
}
