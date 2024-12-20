#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Configurable file paths.
 */
const CONFIG = {
  inputFilePath: path.resolve(__dirname, '../src/data/svgs.json'), // Input file path
  outputDir: path.resolve(__dirname, '../src/data/categories/'), // Directory for output files
  svgBasePath: path.resolve(__dirname, '../src/assets/svgl/'), // Base directory for reading SVGs
  svgPublicPath: '/assets/svgl', // Public path for SVGs
};

/**
 * Class to process SVG items and generate categorized JSON files.
 */
class SvgProcessor {
  /**
   * Processes all items and generates categorized output.
   * @param {Array<Object>} items - Array of items from svgl.json.
   * @returns {Promise<Object>} - Categorized items and all items.
   */
  static async processAll(items) {
    const categorizedItems = [];
    const allItems = [];

    for (const item of items) {
      const processed = await this.processItem(item);
      if (processed) {
        categorizedItems.push(...processed);
        allItems.push(...processed);
      }
    }

    String.prototype.toUppercase = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    const allCategories = categorizedItems
      .reduce((acc, item) => {
        const categories = Array.isArray(item.category)
          ? item.category
          : [item.category];
        for (const category of categories) {
          if (!acc.includes(category)) {
            acc.push(category);
          }
        }
        return acc;
      }, [])
      .sort((a, b) => a.localeCompare(b));

    const categorized = allCategories
      .map((category) => {
        const categoryKey = category.toLowerCase().replace(/ /g, '-');
        const items = allItems.filter((item) =>
          item.category.includes(category)
        );
        return {
          id: categoryKey.toLowerCase().replace(/ /g, '-'),
          title: category.toUppercase(),
          items: items,
          count: items.length,
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => a.title.localeCompare(b.title));
    return { categorized, allItems };
  }

  /**
   * Processes a single item based on the provided logic.
   * @param {Object} item - The item to process.
   * @returns {Promise<Array<Object>|null>} - Processed item or null on failure.
   */
  static async processItem(item) {
    try {
      const logoItems = [];
      const id = item.id || item.title.toLowerCase().replace(/ /g, '-');
      const title = item.title;
      const description = `Logo for ${title} for Category: ${[item.category].flat().join(', ')}`;
      const category = Array.isArray(item.category)
        ? item.category
        : [item.category || 'Uncategorized'];
      const url = item.url || '';

      if (typeof item.route === 'string') {
        const svgContent = this.loadSvg(this.resolvePath(item.route));
        const filePath = this.getPathForOutput(item.route);

        if (!svgContent) {
          console.warn(`SVG not loaded for: ${item.title}`);
          return null;
        }
        logoItems.push({
          id,
          title,
          description,
          category,
          path: filePath,
          svgContent,
          url,
        });
      } else if (item.route) {
        await this.processRouteVariants(
          item.route,
          logoItems,
          id,
          title,
          description,
          category,
          url
        );
      }

      if (item.wordmark) {
        await this.processWordmark(
          item.wordmark,
          logoItems,
          id,
          title,
          description,
          category,
          url
        );
      }

      return logoItems;
    } catch (error) {
      console.error(`Error processing item ${item.title}:`, error);
      return null;
    }
  }

  /**
   * Processes route variants (dark and light).
   * @param {Object} route - The route object containing dark and light paths.
   * @param {Array<Object>} logoItems - Array to collect processed items.
   * @param {string} id - The ID of the item.
   * @param {string} title - The title of the item.
   * @param {string} description - The description of the item.
   * @param {Array<string>} category - The categories of the item.
   * @param {string} url - The URL of the item.
   * @returns {Promise<void>}
   */
  static async processRouteVariants(
    route,
    logoItems,
    id,
    title,
    description,
    category,
    url
  ) {
    if (route.dark && route.light) {
      const darkPath = this.resolvePath(route.dark);
      const lightPath = this.resolvePath(route.light);
      const darkSvgContent = this.loadSvg(darkPath);
      const lightSvgContent = this.loadSvg(lightPath);

      if (darkSvgContent) {
        logoItems.push({
          id: `${id}-dark`,
          title,
          description: `${description} Dark`,
          category,
          path: this.getPathForOutput(route.dark),
          svgContent: darkSvgContent,
          url,
        });
      }

      if (lightSvgContent) {
        logoItems.push({
          id: `${id}-light`,
          title,
          description: `${description} Light`,
          category,
          path: this.getPathForOutput(route.light),
          svgContent: lightSvgContent,
          url,
        });
      }
    }
  }

  /**
   * Processes wordmark variants.
   * @param {Object|string} wordmark - The wordmark object or path.
   * @param {Array<Object>} logoItems - Array to collect processed items.
   * @param {string} id - The ID of the item.
   * @param {string} title - The title of the item.
   * @param {string} description - The description of the item.
   * @param {Array<string>} category - The categories of the item.
   * @param {string} url - The URL of the item.
   * @returns {Promise<void>}
   */
  static async processWordmark(
    wordmark,
    logoItems,
    id,
    title,
    description,
    category,
    url
  ) {
    id = `${id}-wordmark`;
    description = `${description} Wordmark`;
    if (typeof wordmark === 'string') {
      const svgContent = this.loadSvg(this.resolvePath(wordmark));
      if (svgContent) {
        logoItems.push({
          id,
          title,
          category,
          path: this.getPathForOutput(wordmark),
          svgContent,
          url,
        });
      }
    } else if (wordmark.dark && wordmark.light) {
      await this.processRouteVariants(
        wordmark,
        logoItems,
        id,
        title,
        description,
        category,
        url
      );
    }
  }

  /**
   * Resolves the absolute path for a given route.
   * @param {string} route - The route to resolve.
   * @returns {string} - The resolved path.
   */
  static resolvePath(route) {
    const routePath = route.replaceAll('library/', '').replaceAll('_', '-');
    return CONFIG.svgBasePath + '/' + routePath;
  }

  /**
   * Converts a route to an output path.
   * @param {string} route - The route to convert.
   * @returns {string} - The output path.
   */
  static getPathForOutput(route) {
    const routePath = route.replaceAll('library/', '').replaceAll('_', '-');
    return CONFIG.svgPublicPath + routePath.startsWith('/')
      ? routePath
      : `/${routePath}`;
  }

  /**
   * Loads SVG content from the given path.
   * @param {string} svgPath - The path to the SVG file.
   * @returns {string|null} - The SVG content or null if an error occurs.
   */
  static loadSvg(svgPath) {
    try {
      if (!fs.existsSync(svgPath)) {
        throw new Error(`SVG file not found at ${svgPath}`);
      }
      return fs.readFileSync(svgPath, 'utf8');
    } catch (error) {
      console.error(`Error reading SVG from ${svgPath}:`, error);
      return null;
    }
  }
}

// Main execution
(async () => {
  if (!fs.existsSync(CONFIG.inputFilePath)) {
    console.error(`Input file does not exist: ${CONFIG.inputFilePath}`);
    return;
  }

  const rawData = fs.readFileSync(CONFIG.inputFilePath, 'utf8');
  const items = JSON.parse(rawData);

  const { categorized, allItems } = await SvgProcessor.processAll(items);

  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  for (const category of Object.values(categorized)) {
    const outputFilePath = path.join(CONFIG.outputDir, `${category.id}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(category.items, null, 2));
    console.log(`Written category file: ${outputFilePath}`);
  }

  const allItemsPath = path.join(CONFIG.outputDir, 'all.json');
  fs.writeFileSync(allItemsPath, JSON.stringify(allItems, null, 2));
  console.log(`Written all items file: ${allItemsPath}`);

  const categoriesFilePath = path.resolve(
    CONFIG.outputDir,
    '../categories.json'
  );
  const categoriesData = Object.values(categorized);
  fs.writeFileSync(categoriesFilePath, JSON.stringify(categoriesData, null, 2));
  console.log(`Written categories file: ${categoriesFilePath}`);

  console.log('Processing complete.');
})();
