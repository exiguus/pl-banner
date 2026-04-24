#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

const GENERATED_PATHS = [
  '../src/data/svgs.ts',
  '../src/types/svgl/categories.ts',
  '../src/types/svgl/svg.ts',
  '../src/data/svgs.json',
  '../src/types/Categories.ts',
  '../src/data/categories.json',
  '../src/data/categories',
  '../src/assets/svgl',
];

function removePath(targetPath) {
  if (!fs.existsSync(targetPath)) {
    console.log(`Skip (not found): ${targetPath}`);
    return;
  }

  if (DRY_RUN) {
    console.log(`Dry run (would remove): ${targetPath}`);
    return;
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
  console.log(`Removed: ${targetPath}`);
}

function main() {
  console.log(
    DRY_RUN
      ? 'Running SVGL cleanup in dry-run mode...'
      : 'Running SVGL cleanup...'
  );

  for (const relativePath of GENERATED_PATHS) {
    const resolvedPath = path.resolve(__dirname, relativePath);
    removePath(resolvedPath);
  }

  console.log('SVGL cleanup complete.');
}

main();
