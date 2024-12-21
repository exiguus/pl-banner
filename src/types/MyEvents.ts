import type { LogoItem } from 'types/LogoItem';

export type SelectionChangeEventDetail = {
  selectedItems: LogoItem[];
  random?: boolean;
  scrollIntoView?: boolean;
};

export type SelectionChangeEvent = {
  target: 'selection-changed';
  detail: SelectionChangeEventDetail;
};

export type WidthChangeEventDetail = {
  width: number;
};

export type WidthChangeEvent = {
  target: 'width-changed';
  detail: WidthChangeEventDetail;
};

export type ChangeDisplayItemsEventDetails = {
  displayItems: LogoItem[];
};

export type ChangeDisplayItemsEvent = {
  target: 'change-display-items';
  detail: ChangeDisplayItemsEventDetails;
};

export type NotifyEventDetail = {
  message: string;
  duration?: number;
  type?: 'info' | 'success' | 'warning' | 'error';
};

export type NotifyEvent = {
  target: 'notify';
  detail: NotifyEventDetail;
};
