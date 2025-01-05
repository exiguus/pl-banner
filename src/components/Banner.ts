import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { MyElement } from 'types/MyElement';
import type { LogoItem } from 'types/LogoItem';
import type { SelectionChangeEventDetail } from 'types/MyEvents';
import 'components/SVGInjector';
import 'components/LoadingSpinner';
import 'components/Logo';

@customElement('my-banner')
export class Banner extends MyElement {
  @property({ type: Array }) items!: LogoItem[];

  static styles = css`
    :host {
      --banner-inner-width: 100%;

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
      padding: var(--grid-padding, 20px 0);
      margin: 0 auto;
      width: var(--banner-width, 1584px);
      height: calc(var(--banner-height, 396px) - 2 * 20px);
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
      grid-template-rows: repeat(auto-fill, minmax(40px, 1fr));
      gap: var(--grid-gap, 32px 16px);
      place-items: center;
      place-content: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      overscroll-behavior: contain;
      will-change: transform;
    }
  `;

  private handleUnselect(item: LogoItem): void {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.dispatchCustomEvent<SelectionChangeEventDetail>({
      target: 'selection-changed',
      detail: {
        selectedItems: this.items,
        random: false,
        scrollIntoView: false,
      },
    });
  }

  private renderButton(item: LogoItem) {
    return html`
      <my-button
        variant="button-banner"
        title=${`
          ${item.title}
          ${item.description}
          ${item.url}
        `}
        @click=${() => this.handleUnselect(item)}
      >
        <my-logo .item=${item}></my-logo>
      </my-button>
    `;
  }
  render(): ReturnType<typeof html> {
    return html`
      <div class="banner-container">
        <div class="banner">
          <div class="banner-outer">
            <div class="banner-inner">
              <div class="banner-grid">
                ${repeat(
                  this.items,
                  (item) => item.id,
                  (item) => this.renderButton(item)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
