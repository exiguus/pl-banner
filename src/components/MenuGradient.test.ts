import { html, fixture, expect } from '@open-wc/testing';
import './MenuGradient';
import { MenuGradient } from './MenuGradient';
import { gradients } from 'types/CSS';
import sinon from 'sinon';

describe('MenuGradient Component', () => {
  let el: MenuGradient;
  const onPickGradient = sinon.spy();

  beforeEach(async () => {
    el = await fixture<MenuGradient>(html`
      <my-menu-gradient .onPickGradient=${onPickGradient}></my-menu-gradient>
    `);
  });

  it('should render correctly', () => {
    expect(el).to.exist;
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot?.querySelector('.gradient-container')).to.exist;
  });

  it('should render all gradients', () => {
    expect(
      el.shadowRoot?.querySelectorAll('.gradient-list my-button')
    ).to.have.lengthOf(gradients.length);
  });

  it('should select the first gradient by default', () => {
    expect(
      el.shadowRoot
        ?.querySelectorAll('.gradient-list my-button')?.[0]
        .shadowRoot?.querySelector('.button-gradient')
        ?.classList.contains('selected')
    ).to.be.true;
  });

  it('should select a gradient on click', () => {
    el.shadowRoot
      ?.querySelectorAll('.gradient-list my-button')?.[1]
      .dispatchEvent(new MouseEvent('click'));
    expect(onPickGradient.calledOnce).to.be.true;
    expect(onPickGradient.calledWith(gradients[1])).to.be.true;

    el.shadowRoot
      ?.querySelectorAll('.gradient-list my-button')?.[2]
      .dispatchEvent(new MouseEvent('click'));
    expect(onPickGradient.calledTwice).to.be.true;
    expect(onPickGradient.calledWith(gradients[2])).to.be.true;
  });
});
