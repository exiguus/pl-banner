const fs = require('fs');
const path = require('path');

/** @const {string} Path to the folder containing SVG files */
const SVG_FOLDER = path.join(__dirname, '../src/assets/svgl');

/** @const {string} Path to the output JSON file */
const OUTPUT_FILE = path.join(__dirname, '../src/assets/names.json');

/**
 * Reads all file names in the specified folder and creates a JSON file.
 * @return {Promise<void>}
 */
async function generateNamesJson() {
  try {
    // Ensure the folder exists
    if (!fs.existsSync(SVG_FOLDER)) {
      throw new Error(`Folder does not exist: ${SVG_FOLDER}`);
    }

    // Read all files in the folder
    const files = await fs.promises.readdir(SVG_FOLDER);

    // Filter only .svg files and transform data
    const fileData = files
      .filter((file) => file.endsWith('.svg'))
      .map((file) => ({
        name: file.replace(/-/g, ' ').replace('.svg', ''),
        path: `/assets/svgl/${file}`,
      }));

    // Write to the output JSON file
    await fs.promises.writeFile(OUTPUT_FILE, JSON.stringify(fileData, null, 2));
    console.log(`JSON file created at: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Main function to execute the JSON generation.
 * @return {Promise<void>}
 */
async function main() {
  await generateNamesJson();
}

// Execute the main function
main();
