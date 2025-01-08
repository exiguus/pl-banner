import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { LogoItem } from 'types/LogoItem';
import type { Categories } from 'types/Categories';
import { MyElement } from 'types/MyElement';
import 'components/Button';
import 'components/LoadingSpinner';
import { ChangeDisplayItemsEventDetails } from 'types/MyEvents';

export type CategoryItem = {
  id: string;
  title: keyof Categories;
  selected: boolean;
  items: LogoItem[];
  count: number;
};

@customElement('my-menu-categories')
export class MenuCategories extends MyElement {
  @property({ type: Array }) items!: LogoItem[];
  @property({ type: Function }) onToggleItem!: (item: LogoItem) => void;
  @state() private categories: CategoryItem[] = [];

  static styles = css`
    :host {
      display: block;
    }
    .menu {
      display: flex;
      color: var(--default-color-light);
      background: var(--default-background-light);
    }

    @media (prefers-color-scheme: dark) {
      .menu {
        color: var(--default-color-dark);
        background: var(--default-background-dark);
      }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    details[open] > summary {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    details[open] > select {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    details > summary {
      display: block;
      padding: var(--button-padding, 15px);
      min-width: 200px;
      font-size: var(--button-font-size, 14px);
      font-weight: var(--button-font-weight, 700);
      line-height: var(--button-line-height, 1);
      cursor: pointer;
      border: none;
      border-radius: var(--button-border-radius, 5px);
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      background-color: var(--button-bg-color, #639381);
      color: var(--button-color, #fff);
      transition: background-color 0.3s;
    }

    details > select {
      width: 100%;
      padding: 0.5rem;
      border-radius: 5px;
    }

    details > select > option {
      padding: 0.5rem;
    }

    details > select > option > small {
      margin-left: 0.5rem;
      color: var(--default-color-light);
      font-size: 0.8rem;
      padding: 0 0.5rem;
      border-radius: 5px;
      background-color: var(--default-background-light);
    }

    .button-group {
      display: flex;
      gap: var(--button-group-gap, 1px);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.initializeCategories();
  }

  private async initializeCategories(): Promise<void> {
    try {
      const items = document.querySelector(
        'script[type="application/json"]#categories'
      )?.textContent;
      if (items) {
        const categories = JSON.parse(items) as CategoryItem[];
        this.categories = categories.map((category) => ({
          ...category,
          selected: true,
          count: category.items.length,
        })) as CategoryItem[];
      }
    } catch (e) {
      console.error(e);
    }
  }

  private handleSelect(event: Event): void {
    const selectedCategories = Array.from(
      (event.target as HTMLSelectElement).selectedOptions
    ).map((option) => option.value);

    this.categories = this.categories.map((c) => ({
      ...c,
      selected: selectedCategories.includes(c.id),
    }));

    this.selectCategory(
      this.categories.filter((category) => category.selected)
    );
  }

  private async selectCategory(categories: CategoryItem[]): Promise<void> {
    const categoryItems = categories.map((category) => category.items);
    const selectedItems = this.items.filter((item) =>
      categoryItems.some((ci) => ci.some((i) => i.id === item.id))
    );

    this.dispatchCustomEvent<ChangeDisplayItemsEventDetails>({
      target: 'change-display-items',
      detail: { displayItems: selectedItems },
    });
  }

  private reset(): void {
    this.categories = this.categories.map((category) => ({
      ...category,
      selected: true,
    }));
    this.selectCategory(this.categories);
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="menu">
        <div class="button-group">
          <details>
            <summary>Filter Categories</summary>
            ${this.categories.length > 0
              ? html`
                  <label class="sr-only" for="categories">Categories</label>
                  <select id="categories" @change=${this.handleSelect} multiple>
                    ${this.categories.map(
                      (category) => html`
                        <option
                          value="${category.id}"
                          .selected=${category.selected && 'selected'}
                        >
                          <strong>${category.title}</strong>
                          <small
                            >${category.count}
                            <span class="sr-only">Items Count</span></small
                          >
                        </option>
                      `
                    )}
                  </select>
                `
              : html`<my-loading-spinner></my-loading-spinner>`}
          </details>
          <my-button variant="button right" @click=${this.reset}
            >Reset</my-button
          >
        </div>
      </div>
    `;
  }
}
