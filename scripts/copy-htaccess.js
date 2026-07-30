#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const destDir = path.join(root, 'dist');
const serverConfigFiles = ['.htaccess', '.user.ini'];

if (!fs.existsSync(destDir)) {
  console.log('No dist directory found; creating it.');
  try {
    fs.mkdirSync(destDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create dist directory:', err);
    process.exit(1);
  }
}

let copiedCount = 0;

for (const fileName of serverConfigFiles) {
  const src = path.join(root, 'public', fileName);
  const dest = path.join(destDir, fileName);

  if (!fs.existsSync(src)) {
    console.log('No server config found at', src);
    continue;
  }

  try {
    fs.copyFileSync(src, dest);
    copiedCount += 1;
    console.log('Copied', fileName, 'to', dest);
  } catch (err) {
    console.error('Failed to copy', fileName + ':', err);
    process.exit(1);
  }
}

if (copiedCount === 0) {
  console.log('No server config files were copied.');
}
