import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './Menu';
import './Banner';
import { SvgLoader } from '../utils/svg-loader';
import { LogoItem } from '../types/LogoItem';

@customElement('my-home')
export class Home extends LitElement {
  @property({ type: Array }) allItems: LogoItem[] = [];
  @property({ type: Array }) preselectedItems: LogoItem[] = [];

  @state() private items: LogoItem[] = [...this.preselectedItems];
  @state() private isLoading: boolean = true;
  @state() private isLoadingDownload: boolean = false;

  static styles = css`
    :host {
      --spinner-color1: #639381;
      --spinner-color2: #533ebb;
      --bg-color: linear-gradient(
        135deg,
        var(--spinner-color1),
        var(--spinner-color2)
      );
      --banner-width: 1584px;
      --banner-height: 396px;
      --container-gap: 20px;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: var(--container-gap, 20px) 0;
    }
    .menu-container {
      margin: 0 auto;
      width: 100%;
    }
    @media (min-width: 1025px) {
      .menu-container {
        max-width: var(--container-desktop-width);
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.loadGridData();
  }

  private async loadGridData(): Promise<void> {
    this.isLoading = true;
    try {
      const loadedItems = await SvgLoader.loadAll(this.allItems);
      this.allItems = loadedItems;
      this.items = this.allItems
        .filter((item) =>
          this.preselectedItems.some(
            (preselectedItem) => preselectedItem.name === item.name
          )
        )
        .sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error during grid initialization:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private randomizeOrder(): void {
    this.items = [...this.items].sort(() => Math.random() - 0.5);
  }

  private sortItems(direction: 'asc' | 'desc' = 'asc'): void {
    this.items = [...this.items].sort((a, b) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }

  private setBackground(color: string): void {
    this.style.setProperty('--bg-color', color);
  }

  private async downloadGridAsImage(): Promise<void> {
    const bannerContainer = this.shadowRoot?.querySelector('my-banner');
    const bannerElement = bannerContainer?.shadowRoot?.querySelector('.banner');
    if (!bannerElement) {
      console.error('Grid element not found!');
      return;
    }

    try {
      this.isLoadingDownload = true;
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(bannerElement as HTMLElement, {
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'banner.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      this.isLoadingDownload = false;
    } catch (error) {
      this.isLoadingDownload = false;
      console.warn('Error capturing grid:', error);
    }
  }

  private handleSelectionChanged(event: CustomEvent): void {
    this.items = this.allItems
      .filter((item) =>
        event.detail.selectedIcons.some(
          (selectedIcon: LogoItem) => selectedIcon.name === item.name
        )
      )
      .sort(() => Math.random() - 0.5);
  }

  private renderMenu(): ReturnType<typeof html> {
    return html`
      <div class="menu-container">
        ${this.isLoading
          ? nothing
          : html`
              <my-menu
                .onRandomize=${this.randomizeOrder.bind(this)}
                .onRandomBackgroundGradient=${this.setBackground.bind(this)}
                .onDownload=${this.downloadGridAsImage.bind(this)}
                .isLoadingDownload=${this.isLoadingDownload}
                .onPickColor=${this.setBackground.bind(this)}
                .onPickGradient=${this.setBackground.bind(this)}
                .icons=${this.allItems}
                .selectedIcons=${this.items}
                .onSort=${this.sortItems.bind(this)}
                @selection-changed=${this.handleSelectionChanged.bind(this)}
              ></my-menu>
            `}
      </div>
    `;
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="container">
        <my-banner
          .items=${this.items}
          .isLoading=${this.isLoading}
        ></my-banner>
        ${this.renderMenu()}
      </div>
    `;
  }
}
