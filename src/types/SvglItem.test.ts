import { expect } from '@open-wc/testing';
import { isSvglItem, SvglItem } from './SvglItem';

describe('isSvglItem', () => {
  it('should return true for a valid SvglItem with basic properties', () => {
    const validItem: SvglItem = {
      title: 'Example Title',
      category: 'All',
      route: { dark: 'dark.svg', light: 'light.svg' },
      url: 'https://example.com',
    };

    expect(isSvglItem(validItem)).to.be.true;
  });

  it('should return true for a valid SvglItem with optional wordmark properties', () => {
    const validItemWithWordmark: SvglItem = {
      title: 'Example Title',
      category: 'All',
      route: { dark: 'dark.svg', light: 'light.svg' },
      url: 'https://example.com',
      wordmark: { dark: 'dark-wordmark.svg', light: 'light-wordmark.svg' },
    };

    expect(isSvglItem(validItemWithWordmark)).to.be.true;
  });

  it('should return false for an object missing required properties', () => {
    const invalidItem = {
      category: 'All',
      route: { dark: 'dark.svg', light: 'light.svg' },
      url: 'https://example.com',
    };

    expect(isSvglItem(invalidItem)).to.be.false;
  });

  it('should return false if the title is not a string', () => {
    const invalidItem = {
      title: 123,
      category: 'All',
      route: { dark: 'dark.svg', light: 'light.svg' },
      url: 'https://example.com',
    };

    expect(isSvglItem(invalidItem)).to.be.false;
  });

  it('should return true for a category that is an array', () => {
    const validItemWithArrayCategory: SvglItem = {
      title: 'Example Title',
      category: ['All', 'CMS'],
      route: { dark: 'dark.svg', light: 'light.svg' },
      url: 'https://example.com',
    };

    expect(isSvglItem(validItemWithArrayCategory)).to.be.true;
  });

  it('should return false for a route that is null', () => {
    const invalidItem = {
      title: 'Example Title',
      category: 'All',
      route: null,
      url: 'https://example.com',
    };

    expect(isSvglItem(invalidItem)).to.be.false;
  });

  it('should return false if wordmark is an invalid type', () => {
    const invalidItem = {
      title: 'Example Title',
      category: 'All',
      route: { dark: 'dark.svg', light: 'light.svg' },
      url: 'https://example.com',
      wordmark: 123,
    };

    expect(isSvglItem(invalidItem)).to.be.false;
  });

  it('should return false for a non-object input', () => {
    expect(isSvglItem(null)).to.be.false;
    expect(isSvglItem(undefined)).to.be.false;
    expect(isSvglItem('string')).to.be.false;
    expect(isSvglItem(123)).to.be.false;
    expect(isSvglItem([])).to.be.false;
  });

  it('should return false for a valid object missing the url property', () => {
    const invalidItem = {
      title: 'Example Title',
      category: 'All',
      route: { dark: 'dark.svg', light: 'light.svg' },
    };

    expect(isSvglItem(invalidItem)).to.be.false;
  });

  it('should return true for valid object with nested optional wordmark properties', () => {
    const validItemWithNestedWordmark: SvglItem = {
      title: 'Example Title',
      category: 'All',
      route: { dark: 'dark.svg', light: 'light.svg' },
      url: 'https://example.com',
      wordmark: { dark: 'dark-wordmark.svg', light: 'light-wordmark.svg' },
    };

    expect(isSvglItem(validItemWithNestedWordmark)).to.be.true;
  });
});
