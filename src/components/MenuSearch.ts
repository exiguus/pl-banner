import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { debounce } from 'utils/debounce';
import { MyElement } from 'types/MyElement';
import type { LogoItem } from 'types/LogoItem';
import type { ChangeDisplayItemsEventDetails } from 'types/MyEvents';
import 'components/Button';

@customElement('my-menu-search')
export class MenuSearch extends MyElement {
  @property({ type: Array }) items!: LogoItem[];
  @property({ type: Array }) displayItems!: LogoItem[];

  @state() private search: string = '';

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

    input {
      display: block;
      padding: var(--input-button-padding, 10px);
      font-size: var(--button-font-size, 14px);
      font-weight: var(--button-font-weight, 700);
      line-height: var(--button-line-height, 1);
      border: 1px solid var(--input-border-color, #639381);
      border-radius: var(--input-border-radius, 5px);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      color: var(--input-color, #fff);
      transition: background-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: var(--input-border-color-focus, #d76d77);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
  }

  private dispatchSelectionChangeEvent(): void {
    this.dispatchCustomEvent<ChangeDisplayItemsEventDetails>({
      target: 'change-display-items',
      detail: {
        displayItems: this.displayItems,
      },
    });
  }

  private handleSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.debouncedSearch(value);
  }

  private performSearch = (searchTerm: string): void => {
    this.search = searchTerm.toLocaleLowerCase().trim();
    if (this.search) {
      this.displayItems = this.search
        .split(' ')
        .map((s) => this.filterItems(s))
        .flat();
    } else {
      this.displayItems = [...this.items];
    }
    this.dispatchSelectionChangeEvent();
  };

  private filterItems = (searchTerm: string): LogoItem[] =>
    this.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm) ||
        [item.category]
          .flat()
          .some((c) => c.toLowerCase().includes(searchTerm)) ||
        item.description?.toLowerCase().includes(searchTerm)
    );

  private debouncedSearch = debounce(this.performSearch, 600);

  private handleClear(event: Event): void {
    event.preventDefault();
    this.performSearch('');
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('items')) {
      this.performSearch(this.search);
    }
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="menu">
        <label class="sr-only" for="filter">Filter</label>
        <input
          type="search"
          id="filter"
          .value=${this.search}
          placeholder="Filter Logos"
          autocomplete="search"
          @input=${this.handleSearch}
        />
        <my-button
          variant="button close right"
          title="Clear Filter"
          .disabled=${this.search === ''}
          @click=${this.handleClear}
        >
          <span class="sr-only">Clear Filter</span>
          <span aria-hidden="true">&times;</span>
        </my-button>
      </div>
    `;
  }
}
