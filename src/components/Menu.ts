import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LogoItem } from 'types/LogoItem';
import { MyElement } from 'types/MyElement';
import 'components/MenuGradient';
import 'components/MenuCanvas';
import 'components/MenuLogoSelect';

@customElement('my-menu')
export class Menu extends MyElement {
  @property({ type: Function }) onRandomize!: () => void;
  @property({ type: Function }) onRandomBackgroundGradient!: (
    gradient: string
  ) => void;
  @property({ type: Function }) onDownload!: () => void;
  @property({ type: Function }) onPickColor!: (color: string) => void;
  @property({ type: Function }) onPickGradient!: (gradient: string) => void;
  @property({ type: Function }) onSort!: (order: 'asc' | 'desc') => void;
  @property({ type: Array }) items!: LogoItem[];
  @property({ type: Array }) selectedItems!: LogoItem[];
  @property({ type: Boolean }) isLoadingDownload!: boolean;
  @property({ type: Number }) bannerWidth!: number;

  static styles = css`
    :host {
      display: block;
      --menu-border-color: #d76d77;
    }
    .container-fluid {
      position: sticky;
      top: 396px;
      z-index: 1;
      opacity: 0;
      animation: fadeIn 0.3s 1s forwards;
      will-change: opacity;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: var(--menu-gap, 16px);
      padding: var(--menu-gap, 16px) 0;
      width: 100%;
      color: var(--default-color-light);
      background: var(--default-background-light);
      border-bottom: 2px solid var(--menu-border-color);
    }
    @media (prefers-color-scheme: dark) {
      .container {
        color: var(--default-color-dark);
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

  render(): ReturnType<typeof html> {
    return html`
      <div class="container-fluid">
        <div class="container">
          <my-menu-canvas
            .onDownload=${this.onDownload}
            .isLoadingDownload=${this.isLoadingDownload}
            .onRandomize=${this.onRandomize}
            .onSort=${this.onSort}
            .onRandomBackgroundGradient=${this.onRandomBackgroundGradient}
            .onPickColor=${this.onPickColor}
            .bannerWidth=${this.bannerWidth}
          ></my-menu-canvas>
          <my-menu-gradient
            .onPickGradient=${this.onPickGradient}
          ></my-menu-gradient>
        </div>
      </div>
      <div class="container">
        <my-menu-logo-select
          .items=${this.items}
          .selectedItems=${this.selectedItems}
        ></my-menu-logo-select>
      </div>
    `;
  }
}
