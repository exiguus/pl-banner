import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import type { LogoItem } from 'types/LogoItem';
import { MyElement } from 'types/MyElement';
import 'components/SVGInjector';
import 'components/LoadingSpinner';

@customElement('my-logo')
export class Logo extends MyElement {
  @property({ type: Object, reflect: true }) item: LogoItem | null = null;

  static styles = css`
    :host {
      display: block;
    }
    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
  }

  render(): ReturnType<typeof html> {
    return html`
      ${guard([this.item], () =>
        this.item
          ? html`
              <div
                class="logo"
                title=${`
                  ${this.item.title}
                  ${this.item.description}
                  ${this.item.url}
                `}
              >
                <my-svg-injector
                  .svgContent="${this.item.svgContent}"
                ></my-svg-injector>
              </div>
            `
          : nothing
      )}
    `;
  }
}
