import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { MyElement } from 'types/MyElement';
import { gradients } from 'types/CSS';
import 'components/Button';

@customElement('my-menu-gradient')
export class MenuGradient extends MyElement {
  @property({ type: Function }) onPickGradient!: (gradient: string) => void;
  @state() private currentGradient = 0;

  static gradientWidth = 40;
  static gradientGap = 8;

  static styles = css`
    :host {
      --gradient-grid-gap: ${MenuGradient.gradientGap}px;
      --gradient-grid-width: ${MenuGradient.gradientWidth}px;
    }
    .gradient-container {
      display: flex;
      white-space: nowrap;
      align-items: center;
      gap: var(--gradient-grid-gap);
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
    }
    .gradient-list {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 0 var(--gradient-grid-gap);
      padding-bottom: var(--gradient-grid-gap);
      margin-right: calc(var(--gradient-grid-gap) + var(--gradient-grid-width));
      margin-bottom: calc(-1 * var(--gradient-grid-gap));
      width: ${gradients.length *
      (MenuGradient.gradientWidth + MenuGradient.gradientGap)}px;
    }
  `;

  private handlePickGradient(index: number): void {
    this.onPickGradient(gradients[index]);
    this.currentGradient = index;
  }

  private renderGradient(
    gradient: string,
    index: number
  ): ReturnType<typeof html> {
    return html`
      <my-button
        variant="button-gradient"
        .selected=${this.currentGradient === index}
        .disabled=${this.currentGradient === index}
        style="--button-gradient-bg: ${gradient};"
        title="Pick Background Gradient: ${gradient}"
        @click=${() => this.handlePickGradient(index)}
      ></my-button>
    `;
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="gradient-container">
        <div class="gradient-list">
          ${repeat(
            gradients,
            (gradient) => gradient,
            (gradient) =>
              this.renderGradient(gradient, gradients.indexOf(gradient))
          )}
        </div>
      </div>
    `;
  }
}
