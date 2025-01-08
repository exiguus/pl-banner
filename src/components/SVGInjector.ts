import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MyElement } from 'types/MyElement';

@customElement('my-svg-injector')
export class SvgInjector extends MyElement {
  @property({ type: String, reflect: true }) svgContent = '';

  static styles = css`
    :host {
      display: block;
      overflow: hidden;
    }
    .svg-container {
      all: unset;
      display: block;
      width: var(--svg-size, 32px);
      height: var(--svg-size, 32px);
      max-width: 100%;
      max-height: 100%;
      overflow: hidden;
    }
    svg {
      width: var(--svg-size, 32px);
      height: var(--svg-size, 32px);
      max-width: 100%;
      max-height: 100%;
    }
  `;

  private injectSVG(container: HTMLElement): void {
    if (!this.svgContent) {
      container.innerHTML = ''; // Clear previous content
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.svgContent, 'image/svg+xml');
      const svgElement = doc.documentElement;

      if (svgElement.nodeName !== 'svg') {
        throw new Error('Provided content is not a valid SVG');
      }

      container.innerHTML = '';
      container.appendChild(svgElement);
    } catch (error) {
      console.error('Error injecting SVG:', error);
      container.innerHTML = ''; // Clear invalid content
    }
  }

  updated() {
    const svgContainer = this.renderRoot.querySelector(
      '.svg-container'
    ) as HTMLElement;
    if (svgContainer) {
      this.injectSVG(svgContainer);
    }
  }

  render() {
    return html`<div class="svg-container" aria-hidden="true"></div>`;
  }
}
