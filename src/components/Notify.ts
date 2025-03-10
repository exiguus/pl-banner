import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import type { NotifyEventDetail } from 'types/MyEvents';
import { MyElement } from 'types/MyElement';
import 'components/LoadingSpinner';

@customElement('my-notify')
export class Notify extends MyElement {
  @state() notification: NotifyEventDetail | null = null;
  private timeout: NodeJS.Timeout | null = null;

  static styles = css`
    :host {
      display: block;
    }
    .notify {
      position: fixed;
      bottom: 4em;
      right: 2em;
      z-index: 10;
    }
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--default-padding, 20px);
      width: calc(100% - 2 * var(--default-padding, 20px));
      max-width: 480px;
      border-radius: var(--default-border-radius, 20px);
      background: var(--default-background-dark);
      color: var(--default-color-dark);
      border-color: var(--default-color-dark);
      border-width: 2px;
      border-style: solid;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
      opacity: 0.99;
      animation: wobble 0.5s ease-out;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
      will-change: transform;
    }
    @media (prefers-color-scheme: dark) {
      .container {
        background: var(--default-background-light);
        color: var(--default-color-light);
        border-color: var(--default-color-light);
      }
    }

    .error {
      border-color: var(--error-color, red);
      background: var(--error-bg-color, pink);
    }

    .warning {
      border-color: var(--warning-color, yellow);
      background: var(--warning-bg-color, lightyellow);
    }

    .info {
      border-color: var(--info-color, blue);
      background: var(--info-bg-color, lightblue);
    }

    .success {
      border-color: var(--success-color, green);
      background: var(--success-bg-color, lightgreen);
    }

    @keyframes wobble {
      0% {
        transform: rotate(0);
      }
      15% {
        transform: rotate(-5deg);
        zoom: 1.1;
      }
      30% {
        transform: rotate(3deg);
        zoom: 0.9;
      }
      45% {
        transform: rotate(-3deg);
        zoom: 1.2;
      }
      60% {
        transform: rotate(2deg);
        zoom: 0.8;
      }
      75% {
        transform: rotate(-1deg);
        zoom: 1;
      }
      100% {
        transform: rotate(0deg);
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(
      'notify',
      ((e: Event) =>
        this.notifyEventHandler(e as CustomEvent<NotifyEventDetail>)).bind(this)
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(
      'notify',
      ((e: Event) =>
        this.notifyEventHandler(e as CustomEvent<NotifyEventDetail>)).bind(this)
    );
    if (this.timeout) clearTimeout(this.timeout);
  }

  private notifyEventHandler(e: CustomEvent<NotifyEventDetail>): void {
    e.preventDefault();
    const { message, duration = 4200, type = 'info' } = e.detail;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.notification) {
      this.notification = null;
    }

    this.timeout = setTimeout(() => {
      this.notification = {
        message,
        duration,
        type,
      };
      this.timeout = setTimeout(() => {
        this.notification = null;
      }, duration);
    }, 200);
  }

  render(): ReturnType<typeof html> {
    return html`
      ${guard([this.notification], () =>
        this.notification !== null
          ? html`
              <div class="notify" aria-live="assertive">
                <div class="container ${this.notification.type}">
                  <p>${this.notification.message}</p>
                </div>
              </div>
            `
          : nothing
      )}
    `;
  }
}
