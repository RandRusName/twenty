import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

const LOCALES_DIR = path.resolve(
  import.meta.dirname,
  '../twenty-front/src/locales',
);

const messageFixesByFile = {
  'cs-CZ.po': [
    {
      msgid: 'Suggested',
      msgstr: 'Navržené',
    },
  ],
  'ca-ES.po': [
    {
      msgid: 'Actions permissions',
      msgstr: "Permisos d'accions",
    },
    {
      msgid: 'Allow exporting data to CSV files',
      msgstr: "Permetre l'exportació de dades a fitxers CSV",
    },
  ],
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const fixFile = (fileName, fixes) => {
  const filePath = path.join(LOCALES_DIR, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const { msgid, msgstr } of fixes) {
    const pattern = new RegExp(
      `msgid "${escapeRegExp(msgid)}"\\nmsgstr "[\\s\\S]*?"`,
      'g',
    );

    const replacement = `msgid "${msgid}"\nmsgstr "${msgstr}"`;

    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  const nullByteCount = fs
    .readFileSync(filePath)
    .filter((byte) => byte === 0).length;

  return { fileName, nullByteCount, changed };
};

const poFiles = globSync('*.po', { cwd: LOCALES_DIR });

const results = poFiles.map((fileName) => {
  const fixes = messageFixesByFile[fileName];

  if (!fixes) {
    const nullByteCount = fs
      .readFileSync(path.join(LOCALES_DIR, fileName))
      .filter((byte) => byte === 0).length;

    return { fileName, nullByteCount, changed: false };
  }

  return fixFile(fileName, fixes);
});

for (const result of results) {
  if (result.nullByteCount > 0 || result.changed) {
    console.log(
      `${result.fileName}: changed=${result.changed}, null bytes=${result.nullByteCount}`,
    );
  }
}

const totalNullBytes = results.reduce(
  (sum, result) => sum + result.nullByteCount,
  0,
);

if (totalNullBytes > 0) {
  console.error(`Still ${totalNullBytes} null bytes across locale PO files.`);
  process.exit(1);
}

console.log('All locale PO files are free of null bytes.');
