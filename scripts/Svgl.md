# SVG Scripts

This repository contains three scripts:

1. **Generate File List**: Fetches a list of files from a GitHub repository and saves the metadata to a JSON file (`svgl.json`).
2. **Download SVG Files**: Downloads SVG files listed in `svgl.json` to a local folder (`assets/svgl`).
3. **Generate Name List**: Extracts the names of SVG files from `assets/svgl` and saves them to a JSON file (`names.json`).

---

## Script 1: Generate File List

### Description

This script fetches the list of files from a GitHub repository directory and saves the metadata to `svgl.json`.

### Features

- Fetches file metadata (name, path, type).
- Saves the metadata as a JSON file named `svgl.json`.
- Skips non-essential details, focusing on file name, path, and type.

### Usage

1. Run the script:

   ```bash
   node scripts/svgl_list.cjs
   ```

2. Output:
   - The `svgl.json` file is created in the assets folder.

---

## Script 2: Download SVG Files

### Description

This script downloads SVG files listed in `assets/svgl.json` to a local folder (`assets/svgl`). It ensures that only SVG files are downloaded. Files that already exist locally are skipped unless the `--force` flag is used.

### Features

- Downloads only `.svg` files.
- Skips existing files unless `--force` is specified.
- Uses a base URL to construct file download links.
- Creates the target folder (`assets/svgl`) if it doesn’t exist.

### Usage

1. Run the script:

   ```bash
   node scripts/svgl_download.cjs
   ```

2. Force download all files (even if they exist):

   ```bash
   node scripts/svgl_download.cjs --force
   ```

3. Output:
   - SVG files are saved in the `assets/svgl` folder.

---

### Script 3: Generate Name List

#### Description

This script extracts the names of SVG files from `assets/svgl` and saves them to `names.json`.

#### Features

- Extracts file names from SVG files.
- Saves the names as a JSON file named `names.json`.

#### Usage

1. Run the script:

   ```bash
   node scripts/svgl_names.cjs
   ```

2. Output:
   - The `names.json` file is created in the assets folder.

- The `names.json` file is created in the assets folder.

---
