import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LogoItem } from 'types/LogoItem';
import { MyElement } from 'types/MyElement';
import 'components/Button';
import 'components/MenuCategories';
import 'components/MenuSearch';

@customElement('my-menu-logo-select-options')
export class MenuLogoSelectOptions extends MyElement {
  @property({ type: Array }) items!: LogoItem[];
  @property({ type: Array }) displayItems!: LogoItem[];
  @property({ type: Function }) onToggleItem!: (item: LogoItem) => void;
  @property({ type: Function }) onSelectAll!: () => void;
  @property({ type: Function }) onUnselectAll!: () => void;
  @property({ type: Function }) onSelectPreselected!: () => void;
  @property({ type: Function }) onSelectRandom!: () => void;

  static styles = css`
    :host {
      display: flex;
      width: 100%;
    }

    .menu {
      display: flex;
      padding-top: calc(var(--menu-padding, 16px) / 2);
      padding-bottom: var(--menu-padding, 16px);
      width: 100%;
      color: var(--default-color-light);
      background: var(--default-background-light);
      border-bottom: 2px solid var(--menu-border-color);
    }

    @media (prefers-color-scheme: dark) {
      .menu {
        color: var(--default-color-dark);
        background: var(--default-background-dark);
      }
    }
    .container {
      display: flex;
      white-space: nowrap;
      align-items: center;
      gap: var(--container-gap, 8px);
    }
    .button-group {
      display: flex;
      gap: var(--button-group-gap, 1px);
    }
  `;

  render(): ReturnType<typeof html> {
    return html`
      <div class="menu">
        <div class="container">
          <div class="button-group">
            <my-button
              data-testid="menu-select-all"
              variant="button left"
              @click=${this.onSelectAll}
              >Select All</my-button
            >
            <my-button
              data-testid="menu-unselect-all"
              variant="button center"
              @click=${this.onUnselectAll}
              >None</my-button
            >
            <my-button
              data-testid="menu-preselected"
              variant="button center"
              @click=${this.onSelectPreselected}
              >Pre-Set</my-button
            >
            <my-button
              data-testid="menu-random"
              variant="button right"
              @click=${this.onSelectRandom}
              >Random</my-button
            >
          </div>
          <my-menu-categories
            .items=${this.items}
            .onToggleItem=${this.onToggleItem.bind(this)}
          ></my-menu-categories>
          <my-menu-search
            .items=${this.items}
            .displayItems=${this.displayItems}
          ></my-menu-search>
        </div>
      </div>
    `;
  }
}
