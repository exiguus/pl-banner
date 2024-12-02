const axios = require('axios');
const fs = require('fs');
const path = require('path');

/** @const {string} Path to the JSON file with file metadata */
const JSON_FILE = path.join(__dirname, '../src/assets/svgl.json');

/** @const {string} Target folder for downloaded SVGs */
const TARGET_FOLDER = path.join(__dirname, '../src/assets/svgl');

/** @const {string} Base URL for file downloads */
const BASE_URL =
  'https://raw.githubusercontent.com/pheralb/svgl/main/static/library';

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
async function downloadFile(url, filePath) {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`Downloaded: ${filePath}`);
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
    throw error;
  }
}

/**
 * Sanatizes a file name by removing invalid characters.
 * @param {string} name - The file name to sanitize.
 * @return {string} The sanitized file name.
 */

function sanitizeFileName(name) {
  // allow only a-z, 0-9, dot, minus and replace it with a dash
  return name.replace(/[^a-z0-9.-]/gi, '-');
}

/**
 * Downloads all SVG files listed in the JSON file.
 * Skips files that already exist unless `forceDownload` is true.
 * @param {boolean} forceDownload - Whether to download files even if they already exist.
 * @return {Promise<void>}
 */
async function downloadAllFiles(forceDownload = false) {
  try {
    const fileData = await fs.promises.readFile(JSON_FILE, 'utf8');
    const files = JSON.parse(fileData);

    for (const file of files) {
      if (!file.name.endsWith('.svg')) {
        console.log(`Skipping non-SVG file: ${file.name}`);
        continue;
      }

      const localFilePath = path.join(
        TARGET_FOLDER,
        sanitizeFileName(file.name)
      );
      const fileExists = fs.existsSync(localFilePath);

      if (fileExists && !forceDownload) {
        console.log(`File already exists (skipped): ${file.name}`);
        continue;
      }

      const fileUrl = `${BASE_URL}/${file.name}`;
      console.log(`Downloading: ${file.name}`);
      await downloadFile(fileUrl, localFilePath);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
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

// Execute the main function
const forceDownload = process.argv.includes('--force');
main(forceDownload);
