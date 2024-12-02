const axios = require('axios');
const fs = require('fs');
const path = require('path');

/** @const {string} GitHub API URL for the target directory */
const GITHUB_API_URL =
  'https://api.github.com/repos/pheralb/svgl/contents/static/library';

/** @const {string} Output file name */
const OUTPUT_FILE = path.join(__dirname, '../src/assets/svgl.json');

/**
 * Fetches the list of files from the GitHub API.
 * @return {Promise<Object[]>} A promise that resolves to an array of file metadata.
 */
async function fetchFiles() {
  try {
    const response = await axios.get(GITHUB_API_URL, {
      headers: {
        'User-Agent': 'Node.js',
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`);
    throw error;
  }
}

/**
 * Writes data to a JSON file.
 * @param {Object[]} data - The data to write.
 * @return {Promise<void>} A promise that resolves when the file has been written.
 */
async function writeToFile(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(OUTPUT_FILE, jsonData);
    console.log(`File list saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Failed to write file: ${error.message}`);
    throw error;
  }
}

/**
 * Main function to fetch file data and write it to a JSON file.
 * @return {Promise<void>}
 */
async function main() {
  try {
    console.log('Fetching file list...');
    const files = await fetchFiles();

    // Filter and format file data
    const fileList = files.map((file) => ({
      name: file.name,
      path: file.path,
      type: file.type,
    }));

    console.log('Writing to JSON file...');
    await writeToFile(fileList);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Execute the main function
main();
