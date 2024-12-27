import { html, css } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import type { WidthChangeEventDetail } from 'types/MyEvents';
import { MyElement } from 'types/MyElement';

@customElement('my-menu-canvas')
export class MenuCanvas extends MyElement {
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
      display: flex;
      gap: 0 10px;
      align-items: center;
      padding: var(--input-button-padding, 10px);
      font-size: var(--button-font-size, 14px);
      font-weight: var(--button-font-weight, 700);
      line-height: var(--button-line-height, 1);
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
    input[type='color'] {
      border: none;
      border-radius: var(--input-border-radius, 5px);
      cursor: pointer;
      width: calc(
        var(--input-button-padding, 10px) * 2 +
          var(--input-button-font-size, 14px)
      );
      height: calc(
        var(--input-button-padding, 10px) * 2 +
          var(--input-button-font-size, 14px)
      );
      margin: calc(var(--input-button-padding, 10px) / -2) 0;
      background: none;
    }
    .container {
      display: flex;
      flex-wrap: no-wrap;
      white-space: nowrap;
      align-items: center;

      gap: var(--container-gap, 8px);
      width: 100%;
      overflow-x: auto;
    }
    .button-group {
      display: flex;
      gap: var(--button-group-gap, 1px);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  private dispatchWidthChangeCustomEvent(width: number) {
    this.dispatchCustomEvent<WidthChangeEventDetail>({
      target: 'width-changed',
      detail: { width },
    });
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
        data-testid="menu-width-${value}"
        disabled=${this.bannerWidth === value ? 'disabled' : undefined}
        .variant="button ${option}"
        .title="Change Banner Width to ${text}"
        @click=${() => this.onWidthChange(value)}
        >${text}</my-button
      >
    `;
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="container">
        <my-button
          variant="button primary"
          data-testid="menu-download"
          @click=${this.onDownload}
          .isLoading=${this.isLoadingDownload}
        >
          Save Banner
        </my-button>
        <my-button data-testid="menu-randomize" @click=${this.onRandomize}
          >Randomize</my-button
        >
        <my-button
          data-testid="menu-sort-asc"
          @click=${() => this.onSort('asc')}
          >Sort A-Z</my-button
        >
        <my-button
          data-testid="menu-sort-desc"
          @click=${() => this.onSort('desc')}
          >Sort Z-A</my-button
        >
        <my-button
          data-testid="menu-random-gradient"
          @click=${this.handleRandomBackgroundGradient}
        >
          Random Gradient
        </my-button>
        <label for="color" data-testid="menu-color">
          <span>Color</span>
          <input id="color" type="color" @input=${this.handeColorChange} />
        </label>
        <label for="width" data-testid="menu-width">
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
