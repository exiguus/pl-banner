import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { MyElement } from 'types/MyElement';
import { gradients } from 'types/CSS';
import 'components/Button';

@customElement('my-menu-gradient')
export class MenuGradient extends MyElement {
  @property({ type: Function }) onPickGradient!: (gradient: string) => void;
  @state() private currentGradient: number = 0;

  static styles = css`
    :host {
      display: block;
    }
    .gradient-container {
      display: flex;
      flex-wrap: nowrap;
      gap: 0 8px;
      overflow-x: auto;
      scroll-behavior: smooth;
    }
    .gradient-list {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      gap: 8px;
      padding-bottom: 8px;
      margin-right: 48px;
      width: ${gradients.length * (40 + 8)}px;
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
