import { Categories } from './Categories';
import { isLogoItem, LogoItem } from './LogoItem';
import { expect } from '@open-wc/testing';

describe('LogoItem', () => {
  it('should validate a valid LogoItem', () => {
    const item: LogoItem = {
      id: '1',
      title: 'Logo 1',
      description: 'Desc 1',
      url: 'https://example.com',
      svgContent: '',
      path: '',
      category: Categories.Framework,
    };
    expect(isLogoItem(item)).to.be.true;
  });

  it('should not validate an invalid LogoItem', () => {
    const item = {
      id: 42,
      title: 'Logo 1',
      url: 'https://example.com',
      svgContent: '',
      category: Categories.Framework,
    };
    expect(isLogoItem(item)).to.be.false;
  });

  it('should not validate an empty object', () => {
    expect(isLogoItem({})).to.be.false;
  });

  it('should not validate an object with missing properties', () => {
    const item = {
      id: '1',
      title: 'Logo 1',
      description: 'Desc 1',
      url: 'https://example.com',
      svgContent: '',
    };
    expect(isLogoItem(item)).to.be.false;
  });

  it('should not validate an object with invalid properties', () => {
    const item = {
      id: '1',
      title: 'Logo 1',
      description: 'Desc 1',
      url: 'https://example.com',
      svgContent: '',
      category: 222,
    };
    expect(isLogoItem(item)).to.be.false;
  });
});
