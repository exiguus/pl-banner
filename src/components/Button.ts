import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MyElement } from 'types/MyElement';
import 'components/LoadingSpinner';

@customElement('my-button')
export class AppButton extends MyElement {
  @property({ type: String }) variant = 'button'; // e.g., primary, secondary
  @property({ type: String }) disabled = '';
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean }) isLoading = false;
  @property({ type: String }) title = '';

  static styles = css`
    :host {
      --spinner-size: 1em;
      --spinner-primary-color: #639381;
      --spinner-secondary-color: #fff;
      --spinner-speed: 0.75s;

      display: inline-block;
    }
    .button {
      display: block;
      padding: var(--button-padding, 15px);
      font-size: var(--button-font-size, 14px);
      font-weight: var(--button-font-weight, 700);
      line-height: var(--button-line-height, 1);
      cursor: pointer;
      border: none;
      border-radius: var(--button-border-radius, 5px);
      background-color: var(--button-bg-color, #639381);
      color: var(--button-color, #fff);
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: var(--button-hover-bg-color, #533ebb);
    }
    .button.primary {
      background-color: var(--button-primary-bg-color, #533ebb);
    }
    .button.primary:hover {
      background-color: var(--button-primary-hover-bg-color, #639381);
    }
    .button:disabled {
      filter: grayscale(90%);
      cursor: not-allowed;
    }
    .button:selection,
    .button.selected {
      border-color: var(--button-selected-border-color, #533ebb);
      background-color: var(--button-selected-bg-color, #639381);
    }

    .button.left {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .button.right {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .button.center {
      border-radius: 0;
    }

    .button.close {
      font-size: calc(var(--button-font-size, 14px) * 2);
      line-height: calc(var(--button-line-height, 1) / 2);
    }

    .button-banner {
      all: unset;
      display: block;
      cursor: pointer;
    }

    .button-gradient {
      width: 40px;
      height: 42px;
      border-radius: 5px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.3s;
      background: var(
        --button-gradient-bg,
        linear-gradient(135deg, #639381, #533ebb)
      );
      border-color: var(--button-gradient-border-color, #639381);
    }
    .button-gradient:hover {
      border-color: var(--button-gradient-hover-border-color, #533ebb);
    }
    .button-gradient[disabled] {
      filter: grayscale(80%);
      cursor: not-allowed;
    }
    .button-gradient.selected {
      border-color: var(--button-gradient-selected-border-color, #533ebb);
    }

    .button-img {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid transparent;
      padding: var(--button-img-padding, 10px);
      border-radius: var(--button-img-border-radius, 10px);
      filter: grayscale(10%);
      transition:
        filter 0.3s,
        border-color 0.3s,
        background-color 0.3s;
    }
    .button-img.selected {
      border-color: var(--button-img-selected-border-color, #533ebb);
      background-color: var(--button-img-selected-bg-color, #639381);
    }
    .button-img:hover {
      background-color: var(--button-img-hover-bg-color, #533ebb);
    }
    .button-img ::slotted(img) {
      width: var(--svg-size, 64px);
      height: var(--svg-size, 64px);
      max-width: 100%;
      max-height: 100%;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .button-img ::slotted(img.loaded) {
      opacity: 1;
    }
    ::slotted(.sr-only) {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    .container-fluid-spinner {
      position: relative;
      display: flex;
      align-items: center;
    }
    .container-spinner {
      position: absolute;
      top: 0;
      width: 100%;
    }

    .visible-hidden {
      visibility: hidden;
    }

    ::slotted(.loading-spinner) {
      width: 1em;
      height: 1em;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('button-click', () => {
      this.dispatchEvent(new Event('click'));
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('button-click', () => {
      this.dispatchEvent(new Event('click'));
    });
  }

  render(): ReturnType<typeof html> {
    return html`
      <button
        class="${this.variant}${this.selected ? ' selected' : ''}"
        ?disabled=${this.disabled}
        title=${this.title}
        ${this.isLoading ? 'aria-busy="true"' : ''}
        ${this.isLoading ? 'aria-label="Loading"' : ''}
      >
        ${this.isLoading
          ? html`<div class="container-fluid-spinner">
              <div class="container-spinner">
                <my-loading-spinner></my-loading-spinner>
              </div>
              <span class="visible-hidden"><slot></slot></span>
            </div>`
          : html`<slot></slot>`}
      </button>
    `;
  }
}
