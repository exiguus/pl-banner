#!/usr/bin/env node
'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Constants for configuration
const FILES = [
  {
    url: 'https://raw.githubusercontent.com/pheralb/svgl/refs/heads/main/src/data/svgs.ts',
    destination: '../src/data/svgs.ts',
  },
  {
    url: 'https://raw.githubusercontent.com/pheralb/svgl/refs/heads/main/src/types/categories.ts',
    destination: '../src/types/svgl/categories.ts',
  },
  {
    url: 'https://raw.githubusercontent.com/pheralb/svgl/refs/heads/main/src/types/svg.ts',
    destination: '../src/types/svgl/svg.ts',
  },
];

const LICENSE_URL =
  'https://raw.githubusercontent.com/pheralb/svgl/refs/heads/main/LICENSE';
const REPO_LINK = 'https://github.com/pheralb/svgl/tree/main';

// Flags
const FORCE_DOWNLOAD = process.argv.includes('--force');

/**
 * Ensures the directory for the given file path exists.
 * @param {string} filePath - File path to ensure directory exists for.
 */
function ensureDirectory(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Downloads content from a URL.
 * @param {string} url - URL to download content from.
 * @returns {Promise<string>} - Content as a string.
 */
async function downloadFile(url) {
  try {
    const response = await axios.get(url, { responseType: 'text' });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to download ${url}: ${err.message}`);
  }
}

/**
 * Adds a banner with license and metadata as a comment to the content.
 * @param {string} content - Original content.
 * @param {string} url - Source URL of the content.
 * @returns {Promise<string>} - Content with the added banner.
 */
async function addBanner(content, url) {
  try {
    const licenseContent = await downloadFile(LICENSE_URL);
    const licenseComment = `/*\n${licenseContent
      .split('\n')
      .map((line) => ` * ${line}`)
      .join('\n')}\n */`;
    return `
/**
 * License: ${LICENSE_URL}
 * Source: ${url}
 * Repository: ${REPO_LINK}
 */
${licenseComment}

${content}`;
  } catch (err) {
    return `
/**
 * License: Unable to fetch (${LICENSE_URL})
 * Source: ${url}
 * Repository: ${REPO_LINK}
 */

${content}`;
  }
}

/**
 * Adjusts `svgs.ts` to update type import paths.
 */
function adjustSvgsTs() {
  const sourceFilePath = path.resolve(__dirname, '../src/data/svgs.ts');

  if (!fs.existsSync(sourceFilePath)) {
    console.error(`Source file not found: ${sourceFilePath}`);
    return;
  }

  const sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');
  const adjustedContent = sourceContent.replace(
    /\"\@\/types\/svg\"/g,
    "'types/svgl/svg'"
  );
  fs.writeFileSync(sourceFilePath, adjustedContent, 'utf-8');

  console.log(`Adjusted file: ${sourceFilePath}`);
}

/**
 * Generates `svgs.json` from `svgs.ts`.
 */
function generateSvgsJson() {
  const sourceFilePath = path.resolve(__dirname, '../src/data/svgs.ts');
  const targetFilePath = path.resolve(__dirname, '../src/data/svgs.json');

  if (!fs.existsSync(sourceFilePath)) {
    console.error(`Source file not found: ${sourceFilePath}`);
    return [];
  }

  const sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');
  const match = sourceContent.match(
    /export const svgs: iSVG\[\] = ([\s\S]*?);/
  );

  if (!match || !match[1]) {
    console.error('Unable to parse svgs from source file.');
    return [];
  }

  let svgContent;
  try {
    svgContent = eval(match[1]);
  } catch (err) {
    console.error('Error parsing svgs:', err.message);
    return [];
  }

  if (!Array.isArray(svgContent)) {
    console.error('Invalid svgs data.');
    return [];
  }

  ensureDirectory(targetFilePath);
  fs.writeFileSync(
    targetFilePath,
    JSON.stringify(svgContent, null, 2),
    'utf-8'
  );
  console.log(`Generated file: ${targetFilePath}`);

  return svgContent;
}

/**
 * Gets unique category values used by SVG data entries.
 * @param {Array<Record<string, unknown>>} svgs - Parsed SVG data.
 * @returns {string[]} - Unique category literals.
 */
function getCategoriesFromSvgs(svgs) {
  if (!Array.isArray(svgs)) {
    return [];
  }

  const categories = new Set();
  for (const item of svgs) {
    const categoryValue = item && item.category;
    if (typeof categoryValue === 'string') {
      categories.add(categoryValue.trim());
      continue;
    }
    if (Array.isArray(categoryValue)) {
      for (const category of categoryValue) {
        if (typeof category === 'string' && category.trim()) {
          categories.add(category.trim());
        }
      }
    }
  }

  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

/**
 * Reads category literals from `src/types/svgl/categories.ts`.
 * @returns {{ sourceContent: string, categories: string[] } | null}
 */
function readSvglCategoryType() {
  const sourceFilePath = path.resolve(
    __dirname,
    '../src/types/svgl/categories.ts'
  );

  if (!fs.existsSync(sourceFilePath)) {
    console.error(`Source file not found: ${sourceFilePath}`);
    return null;
  }

  const sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');
  const match = sourceContent.match(
    /export\s+type\s+(?:tCategory|Category)\s*=([\s\S]*?);/
  );

  if (!match || !match[1]) {
    console.error('Unable to parse Category type from source file.');
    return null;
  }

  const categoryLiterals = Array.from(
    match[1].matchAll(/["']([^"']+)["']/g),
    (result) => result[1].trim()
  ).filter(Boolean);

  return {
    sourceContent,
    categories: Array.from(new Set(categoryLiterals)).sort((a, b) =>
      a.localeCompare(b)
    ),
  };
}

/**
 * Synchronizes `src/types/svgl/categories.ts` with categories found in svgs data.
 * @param {string[]} svgsCategories - Categories discovered in svgs data.
 */
function syncSvglCategoryType(svgsCategories = []) {
  const sourceFilePath = path.resolve(
    __dirname,
    '../src/types/svgl/categories.ts'
  );
  const parsed = readSvglCategoryType();

  if (!parsed) {
    return;
  }

  const merged = Array.from(
    new Set([...parsed.categories, ...svgsCategories])
  ).sort((a, b) => a.localeCompare(b));

  const nextTypeBlock = `export type Category =\n${merged
    .map((category) => `  | "${category}"`)
    .join('\n')};`;

  const updatedContent = parsed.sourceContent.replace(
    /export\s+type\s+(?:tCategory|Category)\s*=[\s\S]*?;/,
    nextTypeBlock
  );

  fs.writeFileSync(sourceFilePath, updatedContent, 'utf-8');
  console.log(`Synchronized category type: ${sourceFilePath}`);
}

/**
 * Generates `Categories.ts` from `categories.ts`.
 */
function generateCategoriesFile() {
  const targetFilePath = path.resolve(__dirname, '../src/types/Categories.ts');

  const parsed = readSvglCategoryType();
  if (!parsed) {
    return;
  }

  const categories = parsed.categories;

  const enumContent = `export enum Categories {
  'All' = 'All',
${categories.map((category) => `  '${category.replace(/\s+/g, ' ').replace(/\(.*?\)/g, '')}' = '${category}',`).join('\n')}
}
`;

  ensureDirectory(targetFilePath);
  fs.writeFileSync(targetFilePath, enumContent, 'utf-8');
  console.log(`Generated file: ${targetFilePath}`);
}

/**
 * Downloads files and processes them.
 */
async function processFiles() {
  for (const { url, destination } of FILES) {
    const filePath = path.resolve(__dirname, destination);

    if (!FORCE_DOWNLOAD && fs.existsSync(filePath)) {
      console.log(`Skipping existing file: ${filePath}`);
      continue;
    }

    try {
      console.log(`Downloading: ${url}`);
      const content = await downloadFile(url);
      const contentWithBanner = await addBanner(content, url);

      ensureDirectory(filePath);
      fs.writeFileSync(filePath, contentWithBanner, 'utf-8');
      console.log(`File saved: ${filePath}`);
    } catch (err) {
      console.error(`Error processing ${url}: ${err.message}`);
    }
  }

  const svgs = generateSvgsJson();
  const svgsCategories = getCategoriesFromSvgs(svgs);
  syncSvglCategoryType(svgsCategories);
  generateCategoriesFile();
  adjustSvgsTs();
}

// Execute the script
processFiles().catch((err) => {
  console.error('Unexpected error:', err.message);
});
