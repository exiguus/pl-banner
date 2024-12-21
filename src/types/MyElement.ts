import { LitElement } from 'lit';

export type MyCustomEventProps<Detail> = {
  target: string;
  detail: Detail;
  bubbles?: boolean;
  composed?: boolean;
};

export class MyElement extends LitElement {
  constructor() {
    super();
  }

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
