import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { LogoItem } from 'types/LogoItem';
import { MyElement } from 'types/MyElement';
import 'components/Button';
import 'components/SVGInjector';
import { NotifyEventDetail } from 'types/MyEvents';

@customElement('my-menu-logo-select-item')
export class MyMenuSelectLogos extends MyElement {
  @property({ type: Array }) items: LogoItem[] = [];
  @property({ type: Array }) selectedItems: LogoItem[] = [];
  @property({ type: Function }) onToggleItem!: (item: LogoItem) => void;

  static styles = css`
    :host {
      --svg-size: 64px;
      display: block;
    }

    .item-selector {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      justify-content: center;
      align-items: center;
      justify-items: center;
      gap: var(--item-selector-gap, 10px);
      overflow-y: auto;
      border: 1px solid var(--item-selector-border-color, #ccc);
      padding: var(--item-selector-padding, 10px);
      background-color: var(--item-selector-bg-color, #f9f9f9);
    }
    @media (prefers-color-scheme: dark) {
      .item-selector {
        border-color: var(--item-selector-dark-border-color, #232323);
        background-color: var(--item-selector-dark-bg-color, #323232);
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
  }

  private copyInfo(item: LogoItem): void {
    const text = `
      id: ${item.id}
      title: ${item.title}
      description: ${item.description}
      url: ${item.url}
    `;

    navigator.clipboard.writeText
      ? navigator.clipboard.writeText(text)
      : prompt(
          'Could not copy to clipboard!',
          text.replace(/\n/g, ' ').replace(/\s+/g, ' ')
        );

    this.dispatchCustomEvent<NotifyEventDetail>({
      target: 'notify',
      detail: {
        message: `Copied to clipboard: "${item.id}" info`,
      },
    });
    console.log('Copied to clipboard');
  }

  private renderItem(item: LogoItem): ReturnType<typeof html> {
    const isSelected = this.selectedItems.some((i) => i.id === item.id);
    return html`
      <my-button
        variant="button-img"
        title="
          id: ${item.id}
          title: ${item.title}
          description: ${item.description}
          url: ${item.url}
        "
        ?selected=${isSelected}
        @click=${() => this.onToggleItem(item)}
        @contextmenu=${() => this.copyInfo(item)}
      >
        <my-svg-injector .svgContent="${item.svgContent}"></my-svg-injector>
        <span class="sr-only">
          id: ${item.id} title: ${item.title} description: ${item.description}
          url: ${item.url}
        </span>
      </my-button>
    `;
  }

  render() {
    const sortedLogoItems = [...this.items].sort((a, b) =>
      a.id.localeCompare(b.id)
    );
    return html`
      ${sortedLogoItems.length > 0
        ? html` <div class="item-selector">
            ${repeat(
              sortedLogoItems,
              (item) => item.id,
              (item) => this.renderItem(item)
            )}
          </div>`
        : html`<p>No items to display</p>`}
    `;
  }
}
