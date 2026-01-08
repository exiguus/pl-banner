#!/usr/bin/env node
'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

/** Path to the JSON file with file metadata. */
const JSON_FILE = path.join(__dirname, '../src/data/svgs.json');

/** Target folder for downloaded SVGs. */
const TARGET_FOLDER = path.join(__dirname, '../src/assets/svgl');

/** Base URL for file downloads. Includes a trailing slash. */
const BASE_URL = 'https://raw.githubusercontent.com/pheralb/svgl/main/static/';

/**
 * Ensures the target folder exists, creating it if necessary.
 * @return {Promise<void>}
 */
async function ensureTargetFolderExists() {
  try {
    await fs.promises.mkdir(TARGET_FOLDER, { recursive: true });
    console.log(`Ensured folder exists: ${TARGET_FOLDER}`);
  } catch (error) {
    console.error(`Failed to create folder: ${error.message}`);
    throw error;
  }
}

/**
 * Downloads a file from a URL and saves it to the specified path.
 * @param {string} url - The URL of the file.
 * @param {string} filePath - The local file path where the file will be saved.
 * @return {Promise<void>}
 */
async function downloadFile(url, filePath, count = 0) {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    count += 1;

    console.log(`Downloaded: ${filePath}`);
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
    // retry two more times
    if (count < 4) downloadFile(url, filePath, count);
  }
}

/**
 * Sanitizes a file name by removing invalid characters.
 * @param {string} name - The file name to sanitize.
 * @return {string} The sanitized file name.
 */
function sanitizeFileName(name) {
  return name.replace(/[^a-z0-9.-]/gi, '-');
}

/**
 * Processes and downloads the files based on the JSON data structure.
 * Downloads files that do not exist or forces downloads if `forceDownload` is true.
 * @param {boolean} forceDownload - Whether to force download files that already exist.
 * @return {Promise<void>}
 */
async function downloadAllFiles(forceDownload = false) {
  try {
    const fileData = await fs.promises.readFile(JSON_FILE, 'utf8');
    const files = JSON.parse(fileData);
    let downloadCount = 0;

    for (const file of files) {
      const routes = [];
      if (typeof file.route === 'string') {
        routes.push({ url: file.route, type: 'default' });
      } else if (typeof file.route === 'object') {
        if (file.route.light) {
          routes.push({ url: file.route.light, type: 'light' });
        }
        if (file.route.dark) {
          routes.push({ url: file.route.dark, type: 'dark' });
        }
      }

      if (file.wordmark) {
        if (typeof file.wordmark === 'string') {
          routes.push({ url: file.wordmark, type: 'wordmark' });
        } else {
          if (file.wordmark.light) {
            routes.push({ url: file.wordmark.light, type: 'wordmark-light' });
          }
          if (file.wordmark.dark) {
            routes.push({ url: file.wordmark.dark, type: 'wordmark-dark' });
          }
        }
      }

      downloadCount += routes.length;

      const downloadFiles = async (routes) => {
        const downloadTasks = routes.map(async ({ url }) => {
          const fileName = sanitizeFileName(
            `${path.basename(url, '.svg')}.svg`
          );
          const localFilePath = path.join(TARGET_FOLDER, fileName);

          if (!forceDownload && fs.existsSync(localFilePath)) {
            console.log(`File already exists (skipped): ${fileName}`);
            return; // Skip the download
          }

          const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
          const fileUrl = `${BASE_URL}${cleanUrl}`;
          console.log(`Downloading: ${fileName}`);
          await downloadFile(fileUrl, localFilePath);
        });

        await Promise.all(downloadTasks); // Wait for all downloads to complete
      };

      // Call the function with your routes
      downloadFiles(routes).catch((error) => {
        console.error('Error downloading files:', error);
      });
    }

    console.log(`Processed ${downloadCount} files to Download`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Main function to ensure the folder exists and download the files.
 * @param {boolean} forceDownload - Whether to force download files that already exist.
 * @return {Promise<void>}
 */
async function main(forceDownload = false) {
  try {
    await ensureTargetFolderExists();
    await downloadAllFiles(forceDownload);
  } catch (error) {
    console.error(`Error in main: ${error.message}`);
  }
}

// Check for the `--force` flag in command-line arguments.
const forceDownload = process.argv.includes('--force');

// Execute the main function.
main(forceDownload);
