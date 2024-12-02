import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-menu-canvas')
export class MenuCanvas extends LitElement {
  @property({ type: Function }) onDownload!: () => void;
  @property({ type: Function }) onRandomize!: () => void;
  @property({ type: Function }) onPickColor!: (color: string) => void;
  @property({ type: Function }) onRandomBackgroundGradient!: (
    gradient: string
  ) => void;
  @property({ type: Boolean }) isLoadingDownload: boolean = false;

  private generateRandomGradient(): string {
    const randomColor1 = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
    const randomColor2 = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
    return `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
  }

  private handleRandomBackgroundGradient(): void {
    const randomGradient = this.generateRandomGradient();
    this.onRandomBackgroundGradient?.(randomGradient);
  }

  static styles = css`
    label {
      display: block;
      padding: var(--input-button-padding, 15px);
      font-size: var(--input-button-font-size, 14px);
      cursor: pointer;
      border: none;
      border-radius: var(--input-button-border-radius, 5px);
      background-color: var(--input-button-bg-color, #639381);
      color: var(--input-button-color, #fff);
      transition: background-color 0.3s;
    }
    label:hover {
      background-color: var(--input-button-hover-bg-color, #533ebb);
    }
    label {
      display: flex;
      gap: 0 10px;
      align-items: center;
    }
    input[type='color'] {
      border: none;
      border-radius: var(--input-border-radius, 5px);
      cursor: pointer;
      width: 30px;
      height: 30px;
      padding: 0;
      margin: calc(-1 * var(--input-button-padding, 15px)) 0;
      background: none;
    }
    .container {
      display: flex;
      flex-wrap: no-wrap;
      white-space: nowrap;
      gap: var(--container-gap, 8px);
      width: 100%;
      overflow-x: auto;
    }
  `;

  render() {
    return html`
      <div class="container">
        <my-button
          variant="button primary"
          @click=${this.onDownload}
          .isLoading=${this.isLoadingDownload}
        >
          Download as PNG
        </my-button>
        <my-button @click=${this.onRandomize}>Randomize Order</my-button>
        <my-button @click=${this.handleRandomBackgroundGradient}>
          Random Background Gradient
        </my-button>
        <label>
          <span>Select Background Color</span>
          <input
            type="color"
            @input=${(e: Event) =>
              this.onPickColor?.((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>
    `;
  }
}
