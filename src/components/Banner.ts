import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import './SVGInjector';
import './LoadingSpinner';
import './Logo';

@customElement('my-banner')
export class Banner extends LitElement {
  @property({ type: Array }) items: { name: string; svgContent: string }[] = [];
  @property({ type: Boolean }) isLoading: boolean = false;

  static styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .banner-container {
      margin-left: -20px;
      margin-right: -20px;
      max-width: 100vw;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .banner {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: var(--grid-gap, 32px 0);
      padding: var(--grid-padding, 24px 0);
      margin: 0 auto;
      background: var(
        --bg-color,
        linear-gradient(
          135deg,
          var(--spinner-color1, #639381),
          var(--spinner-color2, #533ebb)
        )
      );
      width: var(--banner-width, 1584px);
      height: calc(var(--banner-height, 396px) - 2 * 24px);
      overflow: hidden;
      overscroll-behavior: contain;
      will-change: transform;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 396px;
    }
  `;

  render(): ReturnType<typeof html> {
    return html`
      <div class="banner-container">
        ${this.isLoading
          ? html`
              <div class="loading-container">
                <my-loading-spinner></my-loading-spinner>
              </div>
            `
          : html`
              <div class="banner">
                ${repeat(
                  this.items,
                  (item) => item.name,
                  (item) => html`<my-logo .item=${item}></my-logo>`
                )}
              </div>
            `}
      </div>
    `;
  }
}
