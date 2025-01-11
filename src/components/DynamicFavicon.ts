import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { convertCategoriesToLogoItems } from 'utils/convertCategories';
import type { LogoItem } from 'types/LogoItem';

@customElement('my-dynamic-favicon')
export class DynamicFavicon extends LitElement {
  private intervalId: number | null = null;
  private allItems: LogoItem[] = [];
  private readonly intervalSec = 3 * 1000;

  connectedCallback() {
    super.connectedCallback();
    this.initializeItems().then(() => {
      this.startFaviconRotation();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopFaviconRotation();
  }

  private async initializeItems(): Promise<void> {
    try {
      const data = document.querySelector(
        'script[type="application/json"]#categories'
      )?.textContent;
      const categories = JSON.parse(data ?? '[]');
      this.allItems = convertCategoriesToLogoItems(categories);
    } catch (e) {
      console.error(e);
    }
  }

  startFaviconRotation() {
    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      const svgData = this.generateRandomSVG();
      const base64Data = this.svgToBase64(svgData);
      const faviconUrl = `data:image/svg+xml;base64,${base64Data}`;

      this.updateFavicon(faviconUrl);
    }, this.intervalSec);
  }

  stopFaviconRotation() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateFavicon(url: string) {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      favicon.setAttribute('type', 'image/x-icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', url);
  }

  svgToBase64(svg: string) {
    return btoa(unescape(encodeURIComponent(svg)));
  }

  generateRandomSVG() {
    const randomIndex = Math.floor(Math.random() * this.allItems.length);
    const item = this.allItems[randomIndex];
    return item.svgContent;
  }

  render(): ReturnType<typeof html> {
    return html`<slot></slot>`;
  }
}

// To use this component, simply add <dynamic-favicon></dynamic-favicon> to your HTML file.
// Example:
// <html>
//   <head>
//     <dynamic-favicon></dynamic-favicon>
//   </head>
//   <body>
//     <h1>Hello, World!</h1>
//   </body>
// </html>
