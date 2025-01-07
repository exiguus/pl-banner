# Documentation for SVG Management Scripts

## Table of Contents

1. [Overview](#overview)
2. [Scripts](#scripts)
   - [svgl_data.cjs](#svgl_datacjs)
   - [svgl_download.cjs](#svgl_downloadcjs)
   - [svgl_generate.cjs](#svgl_generatecjs)
3. [Usage](#usage)

---

## Overview

This repository contains three scripts in `scripts/` for managing and processing SVG files:

- **Data Management**: Handles file metadata and adjustments.
- **Downloading**: Automates downloading SVG files from a remote source.
- **Processing**: Categorizes and organizes SVGs into structured JSON files.

To run all scripts in sequence, run the `pnpm assets`.

---

## Scripts

### `svgl_data.cjs`

#### Description

This script ensures the necessary files and directories exist, downloads files from remote sources, and adjusts type imports for a clean structure.

#### Features

- Downloads files from a list of URLs.
- Adds license and metadata banners to downloaded files.
- Adjusts `svgs.ts` for proper type import paths.
- Generates `svgs.json` from `svgs.ts`.

#### Key Functions

1. **ensureDirectory(filePath)**: Ensures directories for a given path exist.
2. **downloadFile(url)**: Fetches content from a URL.
3. **addBanner(content, url)**: Adds a license and metadata banner to content.
4. **generateCategoriesFile()**: Creates a category file from the `categories.ts` file.
5. **generateSvgsJson()**: Converts TypeScript `svgs.ts` to JSON format.

#### Execution

Run this script to update the data structure and prepare for SVG processing.

---

### `svgl_download.cjs`

#### Description

Downloads SVG files listed in `svgs.json` and stores them in a designated folder.

#### Features

- Supports light and dark variants of SVG files.
- Ensures the target folder structure exists.
- Skips downloads for existing files unless forced.

#### Key Functions

1. **ensureTargetFolderExists()**: Creates the target folder if missing.
2. **downloadFile(url, filePath)**: Streams a file from a URL to the local filesystem.
3. **downloadAllFiles(forceDownload)**: Iterates through `svgs.json` and downloads files based on metadata.

#### Usage

Run this script to download all SVG assets to your local repository. Use the `--force` flag to overwrite existing files.

---

### `svgl_generate.cjs`

#### Description

Processes downloaded SVG files, categorizes them, and generates structured JSON files for use in applications.

#### Features

- Organizes SVGs by categories defined in `svgs.json`.
- Generates category-wise JSON files and a consolidated `all.json`.
- Handles wordmark variants and dark/light themes.

#### Key Functions

1. **processAll(items)**: Processes all SVG items and organizes them into categories.
2. **processItem(item)**: Handles the processing of individual SVG items.
3. **processRouteVariants(route, logoItems, ...)**: Manages light/dark route variations.
4. **loadSvg(svgPath)**: Loads SVG content from the filesystem.
5. **resolvePath(route)**: Resolves a route to an absolute file path.

#### Execution

Run this script after downloading SVG files to generate categorized JSON outputs.

---

## Usage

### Prerequisites

- Ensure Node.js is installed.
- Install necessary dependencies using `pnpm install`.

### Execution

1. **Data Preparation**:

   ```bash
   node svgl_data.cjs
   ```

2. **Download SVGs**:

   ```bash
   node svgl_download.cjs [--force]
   ```

3. **Generate Categorized Data**:

   ```bash
   node svgl_generate.cjs
   ```

### Flags

- `--force`: Force re-download of existing files.

---

## Notes

- Ensure proper configuration of paths in each script.
- Adjust the `BASE_URL` and `inputFilePath` as required for your project structure.
- Outputs are stored in the `src/data` directory for further use.
