#!/usr/bin/env node
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
/**
 * Processes all items and generates categorized output.
 * @param {Array<Object>} items - Array of items from svgl.json.
 * @returns {Promise<Object>} - Categorized items and all items.
 */
async function processAll(items) {
  const allItems = new Map();

  for (const item of items) {
    const processed = await processItem(item);
    if (processed) {
      for (const item of processed) {
        if (allItems.has(item.id)) {
          console.warn(`Duplicate item ID: ${item.id}`);
        } else {
          allItems.set(item.id, item);
        }
      }
    }
  }

  String.prototype.toUppercase = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  const categorizedItems = Array.from(allItems.values());
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
      const items = Array.from(allItems.values()).filter((item) =>
        item.category.includes(category)
      );
      return {
        id: categoryKey.toLowerCase().replace(/ /g, '-'),
        title: category.toUppercase(),
        items: items.sort((a, b) => a.id.localeCompare(b.id)),
        count: items.length,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => a.id.localeCompare(b.title));
  return {
    categorized,
    allItems: Array.from(allItems.values()).sort((a, b) =>
      a.id.localeCompare(b.id)
    ),
  };
}

/**
 * Processes a single item based on the provided logic.
 * @param {Object} item - The item to process.
 * @returns {Promise<Array<Object>|null>} - Processed item or null on failure.
 */
async function processItem(item) {
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
      const svgContent = loadSvg(resolvePath(item.route));
      const filePath = getPathForOutput(item.route);

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
      await processRouteVariants(
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
      await processWordmark(
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
async function processRouteVariants(
  route,
  logoItems,
  id,
  title,
  description,
  category,
  url
) {
  if (route.dark && route.light) {
    const darkPath = resolvePath(route.dark);
    const lightPath = resolvePath(route.light);
    const darkSvgContent = loadSvg(darkPath);
    const lightSvgContent = loadSvg(lightPath);

    if (darkSvgContent) {
      logoItems.push({
        id: `${id}-dark`,
        title,
        description: `${description} Dark`,
        category,
        path: getPathForOutput(route.dark),
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
        path: getPathForOutput(route.light),
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
async function processWordmark(
  wordmark,
  logoItems,
  id,
  title,
  description,
  category,
  url
) {
  const newId = `${id}-wordmark`;
  const newDescription = `${description} Wordmark`;
  if (typeof wordmark === 'string') {
    const svgContent = loadSvg(resolvePath(wordmark));
    if (svgContent) {
      logoItems.push({
        id: newId,
        title,
        description: newDescription,
        category,
        path: getPathForOutput(wordmark),
        svgContent,
        url,
      });
    }
  } else if (wordmark.dark && wordmark.light) {
    await processRouteVariants(
      wordmark,
      logoItems,
      newId,
      title,
      newDescription,
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
function resolvePath(route) {
  const routePath = route.replaceAll('library/', '').replaceAll('_', '-');
  return `${CONFIG.svgBasePath}/${routePath}`;
}

/**
 * Converts a route to an output path.
 * @param {string} route - The route to convert.
 * @returns {string} - The output path.
 */
function getPathForOutput(route) {
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
function loadSvg(svgPath) {
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

// Main execution
(async () => {
  if (!fs.existsSync(CONFIG.inputFilePath)) {
    console.error(`Input file does not exist: ${CONFIG.inputFilePath}`);
    return;
  }

  const rawData = fs.readFileSync(CONFIG.inputFilePath, 'utf8');
  const items = JSON.parse(rawData);

  const { categorized, allItems } = await processAll(items);

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

  console.log(
    `Processing complete. Processed ${allItems.length} items in ${categorized.length} categories.`
  );
})();
