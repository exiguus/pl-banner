import { html, css, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import './LoadingSpinner';
import { LogoItem } from '../types/LogoItem';

@customElement('my-logo')
export class Logo extends LitElement {
  @property({ type: Object }) item: LogoItem | null = null;

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
              <div class="logo" title=${this.item.title}>
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
