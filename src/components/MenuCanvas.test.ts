import { html, fixture, expect } from '@open-wc/testing';
import './MenuCanvas';
import { MenuCanvas } from './MenuCanvas';
import sinon from 'sinon';

describe('MenuCanvas Component', () => {
  let el: MenuCanvas;
  const onDownload = sinon.spy();
  const onRandomize = sinon.spy();
  const onSort = sinon.spy();
  const onPickColor = sinon.spy();
  const onRandomBackgroundGradient = sinon.spy();
  const bannerWidth = 100;

  beforeEach(async () => {
    el = await fixture<MenuCanvas>(html`
      <my-menu-canvas
        .onDownload=${onDownload}
        .onRandomize=${onRandomize}
        .onSort=${onSort}
        .onPickColor=${onPickColor}
        .onRandomBackgroundGradient=${onRandomBackgroundGradient}
        .bannerWidth=${bannerWidth}
      ></my-menu-canvas>
    `);
  });

  it('should render correctly', () => {
    expect(el).to.exist;
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('.container')).to.exist;
  });

  it('should call onDownload on click', () => {
    el.shadowRoot
      ?.querySelector('[data-testid="menu-download"]')
      ?.dispatchEvent(new MouseEvent('click'));
    expect(onDownload.calledOnce).to.be.true;
  });

  it('should call onRandomize on click', () => {
    el.shadowRoot
      ?.querySelector('[data-testid="menu-randomize"]')
      ?.dispatchEvent(new MouseEvent('click'));
    expect(onRandomize.calledOnce).to.be.true;
  });

  it('should call onSort on click', () => {
    el.shadowRoot
      ?.querySelector('[data-testid="menu-sort-asc"]')
      ?.dispatchEvent(new MouseEvent('click'));
    expect(onSort.calledOnce).to.be.true;

    el.shadowRoot
      ?.querySelector('[data-testid="menu-sort-desc"]')
      ?.dispatchEvent(new MouseEvent('click'));
    expect(onSort.calledTwice).to.be.true;
  });

  it('should call onPickColor on click', () => {
    el.shadowRoot
      ?.querySelector('[data-testid="menu-color"] input[type="color"]')
      ?.dispatchEvent(new Event('input'));
    expect(onPickColor.calledOnce).to.be.true;
  });

  it('should call onRandomBackgroundGradient on click', () => {
    el.shadowRoot
      ?.querySelector('[data-testid="menu-random-gradient"]')
      ?.dispatchEvent(new MouseEvent('click'));
    expect(onRandomBackgroundGradient.calledOnce).to.be.true;
  });

  it('should render default button full width disabled', () => {
    const button = el.shadowRoot?.querySelector(
      '[data-testid="menu-width-100"]'
    );
    expect(button).to.exist;
    expect(button?.hasAttribute('disabled')).to.be.true;
  });

  it('should render button width 75% disabled on click', () => {
    const button = el.shadowRoot?.querySelector(
      '[data-testid="menu-width-75"]'
    );
    expect(button).to.exist;
    expect(button?.hasAttribute('disabled')).to.be.true;
  });

  it('should render correct width input range', () => {
    const input = el.shadowRoot?.querySelector(
      '[data-testid="menu-width"] input[type="range"]'
    );
    expect(input).to.exist;
    expect(input?.getAttribute('value')).to.equal('100');
  });

  it('should render correct width input range on change', async () => {
    el.bannerWidth = 60;
    await el.updateComplete;

    const input = el.shadowRoot?.querySelector(
      '[data-testid="menu-width"] input[type="range"]'
    );
    expect(input).to.exist;
    expect(input?.getAttribute('value')).to.equal('60');

    input?.setAttribute('value', '80');
    input?.dispatchEvent(new Event('change'));
    expect(input?.getAttribute('value')).to.equal('80');
    expect(el.bannerWidth).to.equal(60);
  });
});
