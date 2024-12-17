import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { LogoItem } from '../types/LogoItem';
import './SVGInjector';
import './LoadingSpinner';
import './Logo';

@customElement('my-banner')
export class Banner extends LitElement {
  @property({ type: Array }) items: LogoItem[] = [];
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
    .banner-outer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--grid-padding, 24px 0);
      margin: 0 auto;
      width: var(--banner-width, 1584px);
      height: calc(var(--banner-height, 396px) - 2 * 24px);
      background: var(
        --bg-color,
        linear-gradient(
          135deg,
          var(--spinner-color1, #639381),
          var(--spinner-color2, #533ebb)
        )
      );
    }
    .banner-inner {
      display: flex;
      justify-content: center;
      align-items: center;
      width: var(--banner-inner-width, 100%);
      margin: 0 auto;
    }
    .banner-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      grid-template-rows: repeat(auto-fill, minmax(24px, 1fr));
      gap: var(--grid-gap, 32px 0);
      place-items: center;
      place-content: center;
      width: 100%;
      height: 100%;
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
                <div class="banner-outer">
                  <div class="banner-inner">
                    <div class="banner-grid">
                      ${repeat(
                        this.items,
                        (item) => item.id,
                        (item) => html`<my-logo .item=${item}></my-logo>`
                      )}
                    </div>
                  </div>
                </div>
              </div>
            `}
      </div>
    `;
  }
}
