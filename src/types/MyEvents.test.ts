import { expect } from '@open-wc/testing';
import type {
  SelectionChangeEvent,
  SelectionChangeEventDetail,
  WidthChangeEvent,
  WidthChangeEventDetail,
  ChangeDisplayItemsEvent,
  ChangeDisplayItemsEventDetails,
  NotifyEvent,
  NotifyEventDetail,
  ComponentErrorEvent,
  ComponentErrorEventDetail,
} from './MyEvents';
import { Categories } from './Categories';

describe('Event Types', () => {
  it('should correctly define SelectionChangeEventDetail', () => {
    const detail: SelectionChangeEventDetail = {
      selectedItems: [
        {
          id: '1',
          title: 'Logo 1',
          description: '',
          url: '',
          svgContent: '',
          category: Categories.Framework,
          path: '',
        },
      ],
      random: true,
      scrollIntoView: true,
    };

    expect(detail)
      .to.have.property('selectedItems')
      .that.is.an('array')
      .with.length(1);
    expect(detail).to.have.property('random', true);
    expect(detail).to.have.property('scrollIntoView', true);
  });

  it('should correctly define SelectionChangeEvent', () => {
    const event: SelectionChangeEvent = {
      target: 'selection-changed',
      detail: {
        selectedItems: [
          {
            id: '1',
            title: 'Logo 1',
            description: '',
            url: '',
            svgContent: '',
            category: Categories.Framework,
            path: '',
          },
        ],
      },
    };

    expect(event).to.have.property('target', 'selection-changed');
    expect(event.detail)
      .to.have.property('selectedItems')
      .that.is.an('array')
      .with.length(1);
  });

  it('should correctly define WidthChangeEventDetail', () => {
    const detail: WidthChangeEventDetail = { width: 120 };

    expect(detail).to.have.property('width', 120);
  });

  it('should correctly define WidthChangeEvent', () => {
    const event: WidthChangeEvent = {
      target: 'width-changed',
      detail: { width: 120 },
    };

    expect(event).to.have.property('target', 'width-changed');
    expect(event.detail).to.have.property('width', 120);
  });

  it('should correctly define ChangeDisplayItemsEventDetails', () => {
    const detail: ChangeDisplayItemsEventDetails = {
      displayItems: [
        {
          id: '1',
          title: 'Logo 1',
          description: '',
          url: '',
          svgContent: '',
          category: Categories.Framework,
          path: '',
        },
      ],
    };

    expect(detail)
      .to.have.property('displayItems')
      .that.is.an('array')
      .with.length(1);
  });

  it('should correctly define ChangeDisplayItemsEvent', () => {
    const event: ChangeDisplayItemsEvent = {
      target: 'change-display-items',
      detail: {
        displayItems: [
          {
            id: '1',
            title: 'Logo 1',
            description: '',
            url: '',
            svgContent: '',
            category: Categories.Framework,
            path: '',
          },
        ],
      },
    };

    expect(event).to.have.property('target', 'change-display-items');
    expect(event.detail)
      .to.have.property('displayItems')
      .that.is.an('array')
      .with.length(1);
  });

  it('should correctly define NotifyEventDetail', () => {
    const detail: NotifyEventDetail = {
      message: 'This is a test notification',
      duration: 3000,
      type: 'info',
    };

    expect(detail).to.have.property('message', 'This is a test notification');
    expect(detail).to.have.property('duration', 3000);
    expect(detail).to.have.property('type', 'info');
  });
  it('should correctly define NotifyEventDetail', () => {
    const detail: NotifyEventDetail = {
      message: 'This is a test notification',
      duration: 3000,
      type: 'info',
    };

    expect(detail).to.have.property('message', 'This is a test notification');
    expect(detail).to.have.property('duration', 3000);
    expect(detail).to.have.property('type', 'info');
  });

  it('should correctly define NotifyEvent', () => {
    const event: NotifyEvent = {
      target: 'notify',
      detail: {
        message: 'This is a test notification',
        type: 'success',
      },
    };

    expect(event).to.have.property('target', 'notify');
    expect(event.detail).to.have.property(
      'message',
      'This is a test notification'
    );
    expect(event.detail).to.have.property('type', 'success');
  });

  it('should correctly define ComponentErrorEventDetail', () => {
    const error = new Error('Test error');
    const detail: ComponentErrorEventDetail = {
      component: 'TestComponent',
      message: 'This is a test error',
      stack: error.stack,
      error,
    };

    expect(detail).to.have.property('component', 'TestComponent');
    expect(detail).to.have.property('message', 'This is a test error');
    expect(detail).to.have.property('stack', error.stack);
    expect(detail).to.have.property('error', error);
  });

  it('should correctly define ComponentErrorEvent', () => {
    const error = new Error('Test error');
    const event: ComponentErrorEvent = {
      target: 'component-error' as unknown as EventTarget,
      detail: {
        component: 'TestComponent',
        message: 'This is a test error',
        stack: error.stack,
        error,
      },
      initCustomEvent: function (
        _type: string,
        _bubbles?: boolean,
        _cancelable?: boolean,
        _detail?: ComponentErrorEventDetail | undefined
      ): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: null,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: null,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (
        _type: string,
        _bubbles?: boolean,
        _cancelable?: boolean
      ): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3,
    };

    expect(event).to.have.property('target', 'component-error');
    expect(event.detail).to.have.property('component', 'TestComponent');
    expect(event.detail).to.have.property('message', 'This is a test error');
    expect(event.detail).to.have.property('stack', error.stack);
    expect(event.detail).to.have.property('error', error);
  });
});
