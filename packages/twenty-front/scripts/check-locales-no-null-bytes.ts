import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

/* oxlint-disable eslint/no-console -- CLI script reports scan results to stdout/stderr */

const LOCALES_ROOT = path.resolve(import.meta.dirname, '../src/locales');

const localeFiles = [
  ...globSync('**/*.po', { cwd: LOCALES_ROOT, absolute: true }),
  ...globSync('generated/**/*.ts', { cwd: LOCALES_ROOT, absolute: true }),
];

const filesWithNullBytes: string[] = [];

for (const filePath of localeFiles) {
  const buffer = fs.readFileSync(filePath);

  if (buffer.includes(0)) {
    filesWithNullBytes.push(filePath);
  }
}

if (filesWithNullBytes.length > 0) {
  console.error('Locale files contain null bytes:');

  for (const filePath of filesWithNullBytes) {
    console.error(`  ${filePath}`);
  }

  process.exit(1);
}

console.log(`Checked ${localeFiles.length} locale files — no null bytes found.`);
