import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './_layout';

@customElement('my-page')
export class Page extends LitElement {
  @property({ type: String }) title = 'Default Page Title';
  @property({ type: String }) description = 'Default description for the page.';

  static styles = css`
    :root {
      color-scheme: light dark;
    }

    :host {
      --font-family: Arial, sans-serif;
      --default-color-light: #333;
      --default-color-dark: #f0f0f0;
      --default-background-light: #f0f0f0;
      --default-background-dark: #333;

      font-family: var(--font-family, Arial, sans-serif);

      display: block;
      color: var(--default-color-light);
      background-color: var(--default-background-light);
      min-height: 100vh;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        color: var(--default-color-dark);
        background-color: var(--default-background-dark);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this._updateMetaInfo();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (
      changedProperties.has('title') ||
      changedProperties.has('description')
    ) {
      this._updateMetaInfo();
    }
  }

  private _updateMetaInfo() {
    // Update the document title
    document.title = this.title;

    // Update or create the meta description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', this.description);
  }

  render(): ReturnType<typeof html> {
    return html`<slot name="layout"></slot>`;
  }
}
