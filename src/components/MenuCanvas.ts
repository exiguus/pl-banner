import { LitElement, html, css } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-menu-canvas')
export class MenuCanvas extends LitElement {
  @property({ type: Function }) onDownload!: () => void;
  @property({ type: Function }) onRandomize!: () => void;
  @property({ type: Function }) onSort!: (order: 'asc' | 'desc') => void;
  @property({ type: Function }) onPickColor!: (color: string) => void;
  @property({ type: Function }) onRandomBackgroundGradient!: (
    gradient: string
  ) => void;
  @property({ type: Boolean }) isLoadingDownload: boolean = false;
  @property({ type: Number }) bannerWidth!: number;

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
      padding: var(--input-button-padding, 10px);
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

  private dispatchWidthChangeCustomEvent(width: number) {
    console.log({ width });
    this.dispatchEvent(
      new CustomEvent('width-changed', {
        detail: { width },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleWidthChangeRange(e: Event) {
    const width = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(width)) {
      this.dispatchWidthChangeCustomEvent(width);
    }
  }

  private onWidthChange(width: number) {
    this.dispatchWidthChangeCustomEvent(width);
  }

  private handeColorChange(e: Event) {
    const color = (e.target as HTMLInputElement).value;
    this.onPickColor?.(color);
  }

  private optionsWidth = [100, 75, 50, 25, 10, 33.333, 66.666];

  private renderButtonChangeWidth(value: number): ReturnType<typeof html> {
    let option = 'center';
    let text = `${value.toFixed(0)}%`;

    if (value === this.optionsWidth[0]) {
      option = 'left';
      text = 'Full width';
    } else if (value === this.optionsWidth[this.optionsWidth.length - 1]) {
      option = 'right';
    }

    return html`
      <my-button
        variant="button ${option}"
        @click=${() => this.onWidthChange(value)}
        disabled=${this.bannerWidth === value ? 'disabled' : undefined}
        >${text}</my-button
      >
    `;
  }

  render() {
    return html`
      <div class="container">
        <my-button
          variant="button primary"
          @click=${this.onDownload}
          .isLoading=${this.isLoadingDownload}
        >
          Save Banner
        </my-button>
        <my-button @click=${this.onRandomize}>Randomize</my-button>
        <my-button @click=${() => this.onSort('asc')}>Sort A-Z</my-button>
        <my-button @click=${() => this.onSort('desc')}>Sort Z-A</my-button>
        <my-button @click=${this.handleRandomBackgroundGradient}>
          Random Gradient
        </my-button>
        <label>
          <span>Color</span>
          <input type="color" @input=${this.handeColorChange} />
        </label>
        <label id="width">
          <span>Width</span>
          <input
            id="width"
            type="range"
            min="5"
            max="100"
            step="5"
            value=${this.bannerWidth}
            @change=${this.handleWidthChangeRange}
          />
        </label>
        <div class="button-group">
          ${repeat(
            this.optionsWidth,
            (value: number) => `button-change-width-${value}`,
            (value: number) => this.renderButtonChangeWidth(value)
          )}
        </div>
      </div>
    `;
  }
}
