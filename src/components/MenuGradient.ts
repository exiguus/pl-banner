import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './Button';

@customElement('my-menu-gradient')
export class MenuGradient extends LitElement {
  @property({ type: Function }) onPickGradient!: (gradient: string) => void;

  private static gradients: string[] = [
    // Gradients with 2 Colors
    'linear-gradient(135deg, #1e3c72, #2a5298)', // Dark blue to medium blue
    'linear-gradient(135deg, #232526, #414345)', // Deep gray to slate gray
    'linear-gradient(135deg, #0f2027, #2c5364)', // Dark teal to muted aqua
    'linear-gradient(135deg, #42275a, #734b6d)', // Plum to dusty purple
    'linear-gradient(135deg, #3a1c71, #d76d77)', // Rich purple to vibrant pink
    'linear-gradient(135deg, #373b44, #485563)', // Charcoal gray to steel blue

    // Gradients with 3 Colors
    'linear-gradient(135deg, #141e30, #243b55, #3c6478)', // Navy to slate blue tones
    'linear-gradient(135deg, #283048, #859398, #b4d2e7)', // Dark blue to teal and soft blue
    'linear-gradient(135deg, #2c3e50, #4ca1af, #2a5298)', // Dark gray-blue to aqua and medium blue

    // Gradients with 4 Colors
    'linear-gradient(135deg, #0f2027, #203a43, #2c5364, #4ca1af)', // Deep teal to aqua
    'linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)', // Dark blue to vibrant purple and light blue
    'linear-gradient(135deg, #232526, #414345, #485563, #6a89cc)', // Gray tones transitioning to light blue

    // New Gradients with 2 Colors
    'linear-gradient(135deg, #ff7e5f, #feb47b)', // Sunset orange to peach
    'linear-gradient(135deg, #6a11cb, #2575fc)', // Vibrant purple to bright blue
    'linear-gradient(135deg, #36d1dc, #5b86e5)', // Aqua to sky blue
    'linear-gradient(135deg, #ff512f, #dd2476)', // Bright orange to hot pink
    'linear-gradient(135deg, #1f4037, #99f2c8)', // Dark green to soft mint
    'linear-gradient(135deg, #485563, #29323c)', // Steel blue to charcoal

    // New Gradients with 3 Colors
    'linear-gradient(135deg, #ff9966, #ff5e62, #ee0979)', // Orange to red to magenta
    'linear-gradient(135deg, #43c6ac, #191654, #0f2027)', // Aqua to deep blue to teal
    'linear-gradient(135deg, #4568dc, #b06ab3, #f093fb)', // Royal blue to purple to soft pink
    'linear-gradient(135deg, #373b44, #4286f4, #6dd5ed)', // Charcoal to bright blue to aqua
    'linear-gradient(135deg, #ff7e5f, #feb47b, #fdbb2d)', // Peach tones transitioning to vibrant yellow

    // New Gradients with 4 Colors
    'linear-gradient(135deg, #0f2027, #2c5364, #36d1dc, #5b86e5)', // Deep teal to aqua to blue
    'linear-gradient(135deg, #141e30, #243b55, #6a89cc, #a8d8ea)', // Navy to slate blue to pastel blue
    'linear-gradient(135deg, #283048, #859398, #dce2e9, #f3f7fa)', // Dark blue to teal to pale white-blue
    'linear-gradient(135deg, #232526, #414345, #a1c4fd, #c2e9fb)', // Gray tones to soft light blues
    'linear-gradient(135deg, #1f4037, #99f2c8, #fdfbfb, #ebedee)', // Green to mint to white
    'linear-gradient(135deg, #485563, #28313b, #4b79a1, #283048)', // Steel blue to gray to muted navy
    'linear-gradient(135deg, #141e30, #243b55, #2a5298, #b4d2e7)', // Deep blue tones transitioning to soft blue

    // New Gradients with 6 Colors
    'linear-gradient(135deg, #1e3c72, #2a5298, #36d1dc, #5b86e5, #b3ffab, #12fff7)', // Blue to teal to pastel green and aqua
    'linear-gradient(135deg, #141e30, #243b55, #6a89cc, #a8d8ea, #f3f4f5, #ffffff)', // Navy to pastel blues and white
    'linear-gradient(135deg, #42275a, #734b6d, #d76d77, #ffaf7b, #ffd194, #ffb347)', // Plum to pink to soft orange tones
    'linear-gradient(135deg, #283048, #859398, #b4d2e7, #f3f7fa, #ffffff, #ece9e6)', // Dark blue to pastel gray and whites
    'linear-gradient(135deg, #373b44, #485563, #6a11cb, #2575fc, #5ffbf1, #c2f9bb)', // Charcoal to vibrant purples and minty greens
    'linear-gradient(135deg, #0f2027, #2c5364, #36d1dc, #5b86e5, #99f2c8, #ebedee)', // Teal to blue to mint to pale white
    'linear-gradient(135deg, #485563, #28313b, #4b79a1, #283048, #1f4037, #a8e063)', // Steel blue to gray to green tones
    'linear-gradient(135deg, #ff9966, #ff5e62, #ee0979, #ff6f61, #ffaa85, #ffd2a5)', // Orange to red to warm coral tones
    'linear-gradient(135deg, #ff7e5f, #feb47b, #fdbb2d, #ffe600, #f7ff00, #d9ff00)', // Sunset orange to peach to vibrant yellows
    'linear-gradient(135deg, #0f2027, #203a43, #2c5364, #36d1dc, #5b86e5, #6c63ff)', // Dark teal to aqua and violet tones
    'linear-gradient(135deg, #232526, #414345, #6a11cb, #b21f1f, #e14eca, #fddb92)', // Gray to purple to vibrant pinks and golds
    'linear-gradient(135deg, #141e30, #243b55, #8a9ba8, #ccd8e1, #f6f6f6, #ffffff)', // Navy to soft blue tones and white
    'linear-gradient(135deg, #ff512f, #dd2476, #b22fba, #5e72e4, #23a6d5, #23d5ab)', // Hot pink to purple to aqua greens
    'linear-gradient(135deg, #ffafbd, #ffc3a0, #ffde9e, #ffefba, #d4fc79, #96e6a1)', // Pastel pink to peach to mint greens
    'linear-gradient(135deg, #0f0c29, #302b63, #24243e, #4a47a3, #8757f8, #ff6e9c)', // Deep purple to vibrant pink tones
  ];

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
      gap: 8px;
      padding-bottom: 8px;
      margin-right: 48px;
      width: ${MenuGradient.gradients.length * (40 + 8)}px;
    }
    .gradient-item {
      width: 40px;
      height: 42px;
      border-radius: 5px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.3s;
    }
    .gradient-item:hover {
      border-color: var(--input-button-hover-bg-color, #533ebb);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
  `;

  render() {
    return html`
      <div class="gradient-container">
        <div class="gradient-list">
          ${MenuGradient.gradients.map(
            (gradient) => html`
              <div
                class="gradient-item"
                style="background: ${gradient};"
                @click=${() => this.onPickGradient(gradient)}
              ></div>
            `
          )}
        </div>
      </div>
    `;
  }
}
