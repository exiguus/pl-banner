import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import './Button';

interface Icon {
  name: string;
  path: string;
}

@customElement('my-menu-logo-select-icons')
export class MyMenuSelectLogos extends LitElement {
  @property({ type: Array }) icons: Icon[] = [];
  @property({ type: Array }) selectedIcons: Icon[] = [];
  @property({ type: Function }) onToggleIcon!: (icon: Icon) => void;

  static styles = css`
    .icon-selector {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: var(--icon-selector-gap, 10px);
      overflow-y: auto;
      border: 1px solid var(--icon-selector-border-color, #ccc);
      padding: var(--icon-selector-padding, 10px);
      background-color: var(--icon-selector-bg-color, #f9f9f9);
    }
    @media (prefers-color-scheme: dark) {
      .icon-selector {
        border-color: var(--icon-selector-dark-border-color, #232323);
        background-color: var(--icon-selector-dark-bg-color, #323232);
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
  }

  private renderIcon(icon: Icon): ReturnType<typeof html> {
    const isSelected = this.selectedIcons.some(
      (item) => item.name === icon.name
    );
    return html`
      <my-button
        variant="button-img"
        title="${icon.name}"
        ?selected=${isSelected}
        @click=${() => this.onToggleIcon(icon)}
      >
        <img
          alt="Logo: ${icon.name}"
          src="${icon.path}"
          @load=${(e: Event) =>
            (e.target as HTMLImageElement).classList.add('loaded')}
        />
        <span class="sr-only">${icon.name} logo</span>
      </my-button>
    `;
  }

  render() {
    const sortedIcons = [...this.icons].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return html`
      <div class="icon-selector">
        ${repeat(
          sortedIcons,
          (icon) => icon.name,
          (icon) => this.renderIcon(icon)
        )}
      </div>
    `;
  }
}
