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
      --linkedin-color: #0a66c2;
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

    @media (max-width: 1024px) {
      .logo-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
      }
    }

    .logo-container :where(h1, p, .logo) {
      line-height: 1.2;
    }

    .logo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-left: -2px;
      min-width: 32px;
      align-self: flex-start;
    }
    .logo h1 {
      display: flex;
      align-items: center;
      font-size: 1.4rem;
      gap: 0 0.5rem;
    }
    .logo .linkedin {
      display: flex;
      align-items: center;
      gap: 0 0.25rem;
      color: var(--linkedin-color);
      font-size: 1.8rem;
      line-height: 1;
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

    @media (max-width: 1024px) {
      div[slot='footer'] p {
        margin: 0;
      }
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
    try {
      const items = document.querySelector(
        'script[type="application/json"]#items'
      )?.textContent;
      if (items) {
        this.allItems = JSON.parse(items) as LogoItem[];
        this.preselectedItems = filterPreselected(this.allItems);
        this.logoItem = this.allItems.filter(
          (item) => item.id === 'linkedin'
        )?.[0];
      }
    } catch (e) {
      console.error(e);
    }
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
                    <h1>
                      <span class="linkedin"
                        >Linked<my-logo .item=${this.logoItem}></my-logo
                      ></span>
                      ${this.title}
                    </h1>
                  </div>`}
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
            <p>LinkedIn ${this.title} &ndash; ${this.description}</p>
            <p>
              &para; Made by
              <a
                href="https://www.gattner.name"
                title="Simon Gattner - Developer"
                >developers</a
              >, for developers
            </p>
            <p>
              GitHub
              <a href="https://github.com/exiguus/pl-banner">
                @exiguus/pl-banner
              </a>
            </p>
            <p>${this.disclaimer}</p>
            <p>
              Thx to <a href="https://github.com/pheralb/svgl">svgl</a> for
              ${this.allItems.length} Developer SVG logos &hearts;
            </p>
            <p>
              If you are the owner of an SVG and prefer it not to be displayed
              here, create an
              <a
                href="https://github.com/exiguus/pl-banner/issues"
                title="GitHub Issues"
                >issue</a
              >
              on GitHub.
            </p>
            <p>Last update: ${new Date().toISOString()}</p>
          </div>
        </my-layout>
      </my-page>
    `;
  }
}
