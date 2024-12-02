import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-loading-spinner')
export class LoadingSpinner extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
    .container {
      display: inline-block;
      width: var(--spinner-size, 50px);
      height: var(--spinner-size, 50px);
      position: relative;
    }
    .sr-only {
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
    .spinner {
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-top: 4px solid var(--spinner-primary-color, #639381);
      border-right: 4px solid var(--spinner-secondary-color, #533ebb);
      border-radius: 50%;
      animation: spin var(--spinner-speed, 1s) linear infinite;
      will-change: transform;
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  render(): ReturnType<typeof html> {
    return html`
      <div class="container" role="status" aria-live="polite">
        <div class="spinner"></div>
        <p class="sr-only">Loading...</p>
      </div>
    `;
  }
}
