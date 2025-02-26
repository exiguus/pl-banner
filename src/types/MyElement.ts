import { customElement } from 'lit/decorators.js';
import { MyStrictElement } from './MyStrictElement';
import { PropertyValueMap } from 'lit';
import { ComponentErrorEventDetail } from './MyEvents';

export type MyCustomEventProps<Detail> = {
  target: string;
  detail: Detail;
  bubbles?: boolean;
  composed?: boolean;
};

@customElement('my-element')
export class MyElement extends MyStrictElement {
  // bubble up errors to the parent component
  connectedCallback(): void {
    try {
      super.connectedCallback();
    } catch (error) {
      this.dispatchError(error);
    }
  }

  disconnectedCallback(): void {
    try {
      super.disconnectedCallback();
    } catch (error) {
      this.dispatchError(error);
    }
  }

  updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    try {
      super.updated(changedProperties);
    } catch (error) {
      this.dispatchError(error);
    }
  }

  performUpdate() {
    try {
      super.performUpdate();
    } catch (error) {
      this.dispatchError(error);
    }
  }

  dispatchError(error: unknown) {
    if (error instanceof Error) {
      const component = this.tagName.toLowerCase();
      this.dispatchCustomEvent<ComponentErrorEventDetail>({
        target: 'component-error',
        detail: {
          component,
          message: error.message,
          stack: error.stack,
          error: error,
        },
      });
    }
  }

  // Dispatch a custom event with a detail object
  dispatchCustomEvent<Detail>({
    target,
    detail,
    bubbles = true,
    composed = true,
  }: MyCustomEventProps<Detail>): void {
    const event = new CustomEvent<Detail>(target, {
      detail,
      bubbles,
      composed,
    });
    this.dispatchEvent(event);
  }
}
