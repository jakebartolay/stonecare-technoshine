#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const src = path.join(root, 'public', '.htaccess');
const destDir = path.join(root, 'dist');
const dest = path.join(destDir, '.htaccess');

if (!fs.existsSync(src)) {
  console.log('No .htaccess found at', src);
  process.exit(0);
}

if (!fs.existsSync(destDir)) {
  console.log('No dist directory found; creating it.');
  try {
    fs.mkdirSync(destDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create dist directory:', err);
    process.exit(1);
  }
}

try {
  fs.copyFileSync(src, dest);
  console.log('Copied .htaccess to', dest);
} catch (err) {
  console.error('Failed to copy .htaccess:', err);
  process.exit(1);
}
