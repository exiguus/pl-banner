import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import 'lit-html/private-ssr-support.js';
import { filterPreselected } from 'utils/preselectedSvgs';
import type { LogoItem } from 'types/LogoItem';
import { MyElement } from 'types/MyElement';
import 'pages/_layout';
import 'pages/_page';
import 'components/Home';
import 'components/Logo';

@customElement('my-index')
export class Index extends MyElement {
  @property({ type: String }) title = '';
  @property({ type: String }) description = '';
  @property({ type: String }) disclaimer = '';

  @state() private allItems: LogoItem[] = [];
  @state() private preselectedItems: LogoItem[] = [];
  @state() private logoItem: LogoItem | null = null;
  @state() private isLoading: boolean = true;

  static styles = css`
    :host {
      display: block;
    }

    .logo-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      opacity: 0;
      animation: fadeIn 0.3s 1.2s forwards;
      will-change: opacity;
    }

    .logo-container :where(h1, p, .logo) {
      line-height: 1.2;
    }

    .logo {
      display: flex;
      margin-left: -2px;
      min-width: 32px;
      align-self: flex-start;
      padding: 24px 0;
    }

    .subtitle-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      opacity: 0;
      animation: fadeIn 0.3s 1.5s forwards;
      will-change: opacity;
    }

    @media (min-width: 1025px) {
      .subtitle-container {
        font-size: 1.2em;
      }
    }

    .disclaimer {
      font-size: 0.75em;
      opacity: 0.5;
      margin-top: -10px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: var(--banner-height, 396px);
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
    this.initializeItems()
      .then(() => {
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      })
      .finally(() => super.connectedCallback());
  }

  disconnectedCallback(): void {
    this.isLoading = true;
    super.disconnectedCallback();
  }

  private async initializeItems(): Promise<void> {
    const items = await import('../data/categories/all.json').then(
      (module) => module.default
    );
    this.allItems = items as LogoItem[];
    this.preselectedItems = filterPreselected(this.allItems);
    this.logoItem = this.allItems.filter((item) => item.id === 'linkedin')?.[0];
  }

  render(): ReturnType<typeof html> {
    return html`
      <my-page title=${this.title} description=${this.description}>
        <my-layout slot="layout">
          <div slot="header">
            <div class="logo-container">
              ${this.isLoading
                ? nothing
                : html` <div class="logo">
                    <my-logo .item=${this.logoItem}></my-logo>
                  </div>`}
              <h1>${this.title}</h1>
              <p class="disclaimer">${this.disclaimer}</p>
            </div>
            <div class="subtitle-container">
              <p>${this.description}</p>
            </div>
          </div>
          <div slot="main">
            ${this.isLoading
              ? html`<div class="loading-container">
                  <my-loading-spinner></my-loading-spinner>
                </div>`
              : html`<my-home
                  .allItems=${this.allItems}
                  .preselectedItems=${this.preselectedItems}
                ></my-home> `}
          </div>
          <div slot="footer">
            <p>${this.title} &ndash; ${this.description}</p>
            <p>
              &para; Made by
              <a
                href="https://www.gattner.name"
                title="Simon Gattner - Developer"
                >developers</a
              >, for developers
            </p>
            <p>
              @customElement("<a
                href="https://www.gattner.name"
                title="Simon Gatter"
                >simon-gattner</a
              >")
            </p>
            <p>${this.disclaimer}</p>
            <p>
              Thx to <a href="https://github.com/pheralb/svgl">svgl</a> for
              ${this.allItems.length} Developer SVG logos &hearts;
            </p>
          </div>
        </my-layout>
      </my-page>
    `;
  }
}
