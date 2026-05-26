import fs from 'node:fs';
import path from 'node:path';

const ruPoPath = path.resolve(
  import.meta.dirname,
  '../twenty-front/src/locales/ru-RU.po',
);

const fixes = [
  [': Future', ': Будущее'],
  [': NotEmpty', ': Не пусто'],
  [': NotNull', ': Не Null'],
  [': Past', ': Прошлое'],
];

let content = fs.readFileSync(ruPoPath, 'utf8');

for (const [msgid, msgstr] of fixes) {
  const pattern = new RegExp(
    `msgid "${msgid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\nmsgstr "[^"]*"`,
    'g',
  );

  content = content.replace(
    pattern,
    `msgid "${msgid}"\nmsgstr "${msgstr}"`,
  );
}

fs.writeFileSync(ruPoPath, content, 'utf8');

const nullByteCount = fs
  .readFileSync(ruPoPath)
  .filter((byte) => byte === 0).length;

console.log(`Fixed operand labels in ru-RU.po`);
console.log(`Null bytes remaining: ${nullByteCount}`);
