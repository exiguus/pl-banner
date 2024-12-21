import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { LogoItem } from 'types/LogoItem';
import type {
  SelectionChangeEventDetail,
  WidthChangeEventDetail,
} from 'types/MyEvents';
import { MyElement } from 'types/MyElement';
import 'components/Menu';
import 'components/Banner';

@customElement('my-home')
export class Home extends MyElement {
  @property({ type: Array }) allItems: LogoItem[] = [];
  @property({ type: Array }) preselectedItems: LogoItem[] = [];

  @state() private items: LogoItem[] = [];
  @state() private isLoadingDownload: boolean = false;
  @state() private bannerWidth: number = 100;

  // LinkedIn Personal Profiles Banner/Background Photo Size 1584 x 396 pixels
  //  see: https://www.linkedin.com/pulse/linkedin-image-size-guide-julie-thomas-tftwc
  static BANNER_WIDTH = 1584;
  static BANNER_HEIGHT = 396;

  static styles = css`
    :host {
      --spinner-color1: #639381;
      --spinner-color2: #533ebb;
      --bg-color: linear-gradient(
        135deg,
        var(--spinner-color1),
        var(--spinner-color2)
      );
      --banner-width: ${Home.BANNER_WIDTH}px;
      --banner-height: ${Home.BANNER_HEIGHT}px;
      --container-gap: 20px 10px;
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
    this.items = [...this.preselectedItems];
    this.scrollBannerIntoView();

    window.addEventListener('resize', this.scrollBannerIntoView.bind(this));
    window.addEventListener(
      'orientationchange',
      this.scrollBannerIntoView.bind(this)
    );
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.scrollBannerIntoView.bind(this));
    window.removeEventListener(
      'orientationchange',
      this.scrollBannerIntoView.bind(this)
    );
    super.disconnectedCallback();
  }

  private scrollBannerIntoView(): void {
    setTimeout(() => {
      const bannerComponent = this.shadowRoot?.querySelector('my-banner');
      const bannerContainer =
        bannerComponent?.shadowRoot?.querySelector('.banner-container');
      const bannerGrid =
        bannerComponent?.shadowRoot?.querySelector('.banner-inner');
      if (bannerContainer && bannerGrid) {
        bannerContainer.scrollLeft =
          Home.BANNER_WIDTH / 2 - window.innerWidth / 2;
      }
    }, 100);
  }

  private randomizeOrder(): void {
    this.items = [...this.items].sort(() => Math.random() - 0.5);
  }

  private sortItems(direction: 'asc' | 'desc' = 'asc'): void {
    this.items = [...this.items].sort((a, b) =>
      direction === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    );
  }

  private setBackground(color: string): void {
    this.style.setProperty('--bg-color', color);
  }

  private async downloadGridAsImage(): Promise<void> {
    const bannerContainer = this.shadowRoot?.querySelector('my-banner');
    const bannerElement =
      bannerContainer?.shadowRoot?.querySelector('.banner-outer');
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

  private handleSelectionChanged(
    event: CustomEvent<SelectionChangeEventDetail>
  ): void {
    const { selectedItems, random, scrollIntoView } = event.detail;
    const newItems = this.allItems.filter((item) =>
      selectedItems.some(
        (selectedIcon: LogoItem) => selectedIcon.id === item.id
      )
    );

    this.items = random
      ? [...newItems].sort(() => Math.random() - 0.5)
      : (this.items = [...newItems]);
    if (scrollIntoView) this.scrollBannerIntoView();
  }

  private updateWidth(width: number): void {
    this.bannerWidth = width;
    this.style.setProperty('--banner-inner-width', `${this.bannerWidth}%`);
    this.scrollBannerIntoView();
  }

  private handleWithChange(event: CustomEvent<WidthChangeEventDetail>): void {
    const { width } = event.detail;
    if (width !== this.bannerWidth) {
      this.updateWidth(width);
    }
  }

  private renderMenu(): ReturnType<typeof html> {
    return html`
      <div class="menu-container">
        <my-menu
          .isLoadingDownload=${this.isLoadingDownload}
          .items=${this.allItems}
          .bannerWidth=${this.bannerWidth}
          .onRandomize=${this.randomizeOrder.bind(this)}
          .onRandomBackgroundGradient=${this.setBackground.bind(this)}
          .onDownload=${this.downloadGridAsImage.bind(this)}
          .onPickColor=${this.setBackground.bind(this)}
          .onPickGradient=${this.setBackground.bind(this)}
          .selectedItems=${this.items}
          .onSort=${this.sortItems.bind(this)}
          @selection-changed=${this.handleSelectionChanged.bind(this)}
          @width-changed=${this.handleWithChange.bind(this)}
        ></my-menu>
      </div>
    `;
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="container">
        <my-banner
          .items=${this.items}
          @selection-changed=${this.handleSelectionChanged.bind(this)}
        ></my-banner>
        ${this.renderMenu()}
      </div>
    `;
  }
}
