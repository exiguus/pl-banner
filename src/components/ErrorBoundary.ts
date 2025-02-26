import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ComponentErrorEvent } from 'types/MyEvents';
import { MyElement } from 'types/MyElement';
import './Button';

@customElement('my-error-boundary')
export class ErrorBoundary extends MyElement {
  @property({ type: String }) fallbackMessage = 'Something went wrong!';

  @state() private hasError = false;
  @state() private errorMessage = '';
  @state() private errorStack = '';
  @state() private component = '';
  @state() private originError: Error | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      'component-error',
      this.handleChildError as unknown as EventListener
    );
    this.addEventListener(
      'unhandledrejection',
      this.handleUnhandledRejection as unknown as EventListener
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      'component-error',
      this.handleChildError as unknown as EventListener
    );
    this.removeEventListener(
      'unhandledrejection',
      this.handleUnhandledRejection as unknown as EventListener
    );
  }

  private handleChildError(event: ComponentErrorEvent) {
    console.error(`Error caught in child component:`, event.detail);
    this.hasError = true;
    this.errorMessage = event.detail.message;
    this.errorStack = event.detail?.stack || '';
    this.originError = event.detail.error || null;
    this.component = event.detail.component;
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    console.error(`Unhandled Promise Rejection:`, event.reason);
    this.hasError = true;
    this.errorMessage = event.reason;
    this.errorStack = event.reason.stack;
    this.originError = event.reason;
    this.component = 'Promise';
  }

  private handleClose() {
    this.hasError = false;
  }

  // Render the component
  render() {
    if (this.hasError) {
      return html`
        <div class="container">
          <div class="error">
            <my-button variant="close" @click=${this.handleClose} title="close"
              >X</my-button
            >
            <h1>Error Boundary</h1>
            <h2>${this.fallbackMessage}</h2>
            <h3>&lt;${this.component}/&gt;: ${this.errorMessage}</h3>
            <h4>Error:</h4>
            <details open>
              <summary>View Origin Error</summary>
              <pre>${this.originError}</pre>
            </details>
            <details>
              <summary>View Error Stack</summary>
              <pre>${this.errorStack}</pre>
            </details>
          </div>
        </div>
      `;
    }
    return html`<slot></slot>`;
  }

  static styles = css`
    popover[open] {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      width: 100vw;
      height: 100vh;
    }
    details {
      display: flex;
      flex-direction: column;
      margin: 1rem;
      padding: 1rem;
      max-width: 100%;
      border-radius: 0.5rem;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.8);
    }
    details summary {
      cursor: pointer;
      font-weight: bold;
      text-decoration: underline;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      width: 80vw;
      max-width: 640px;
      margin: 2rem auto;
    }
    .error {
      display: flex;
      flex-direction: column;
      padding: 1rem 2rem;
      color: red;
      border: 1px solid red;
      font-family: Arial, sans-serif;
      width: 100%;
      max-height: 80vh;
      background: rgba(255, 0, 0, 0.1);
      overflow-y: auto;
    }
    .error pre {
      overflow-x: auto;
      white-space: pre-wrap;
      padding: 1rem 0;
      width: 100%;
      font-size: 0.8rem;
    }
  `;
}
