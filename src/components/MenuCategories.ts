import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LogoItem } from '../types/LogoItem';
import { Categories } from '../types/Categories';
import categories from '../data/categories.json';

export type CategoryItem = {
  id: string;
  title: keyof Categories;
  selected: boolean;
  items: string[];
};

@customElement('my-menu-categories')
export class Menu extends LitElement {
  @property({ type: Array }) items: LogoItem[] = [];
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
      padding: var(--button-padding, 16px);
      font-size: var(--button-font-size, 14px);
      cursor: pointer;
      border: none;
      border-radius: var(--button-border-radius, 5px);
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
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.categories = categories.map((category) => ({
      id: category.id,
      title: category.title as keyof Categories,
      items: category.items,
      selected: false,
    }));
  }

  private validCategory(category: string): boolean {
    return (
      typeof category === 'string' && categories.some((c) => c.id === category)
    );
  }

  private handleSelect(event: Event): void {
    const selectedCategories = Array.from(
      (event.target as HTMLSelectElement).selectedOptions
    ).map((option) => option.value);

    if (selectedCategories.every(this.validCategory)) {
      this.categories = this.categories.map((c) => ({
        ...c,
        selected: selectedCategories.includes(c.id),
      }));

      this.selectCategory(
        this.categories.filter((category) => category.selected)
      );
    } else {
      console.warn('Category not found or invalid', selectedCategories);
    }
  }

  private async selectCategory(categories: CategoryItem[]): Promise<void> {
    const items = categories.map((category) => category.items).flat();
    const selectedItems = this.items.filter((item) => items.includes(item.id));

    this.dispatchEvent(
      new CustomEvent('selection-changed', {
        detail: { selectedItems: selectedItems },
        bubbles: true,
        composed: true,
      })
    );
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="menu">
        <details>
          <summary>Categories</summary>
          <label class="sr-only" for="categories">Categories</label>
          <select id="categories" @change=${this.handleSelect} multiple>
            ${this.categories.map(
              (category) => html`
                <option value="${category.id}">${category.title}</option>
              `
            )}
          </select>
        </details>
      </div>
    `;
  }
}
