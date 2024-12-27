import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

export type MyCustomEventProps<Detail> = {
  target: string;
  detail: Detail;
  bubbles?: boolean;
  composed?: boolean;
};

@customElement('my-element')
export class MyElement extends LitElement {
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
