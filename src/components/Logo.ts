import { html, css, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { SvgLoader } from '../utils/svg-loader';
import './LoadingSpinner';
import { isLogoItem } from '../types/LogoItem';

@customElement('my-logo')
export class Logo extends LitElement {
  @property({ type: Object }) item: {
    name: string;
    svgContent?: string;
    path?: string;
  } | null = null;

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
    this.loadLogo();
  }

  async loadLogo() {
    if (!isLogoItem(this.item) || this.item.svgContent) {
      if (!this.item?.svgContent)
        console.warn('No SVG content found for', this.item);
    } else {
      this.item = {
        ...this.item,
        ...(await SvgLoader.processItem(this.item)),
      };
      this.requestUpdate();
    }
  }

  render(): ReturnType<typeof html> {
    return html`
      ${guard([this.item?.svgContent], () =>
        this.item?.svgContent
          ? html`
              <div class="logo" title=${this.item.name}>
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
