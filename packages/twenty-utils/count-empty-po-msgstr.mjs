import fs from 'node:fs';

const countEmpty = (path) => {
  const content = fs.readFileSync(path, 'utf8');
  const blocks = content.split(/\n\n+/);
  let empty = 0;
  let total = 0;

  for (const block of blocks) {
    if (!block.includes('msgid')) {
      continue;
    }

    const msgidMatch = block.match(/^msgid "((?:\\"|[^"])*)"/m);

    if (!msgidMatch) {
      continue;
    }

    if (msgidMatch[1] === '') {
      continue;
    }

    total += 1;

    const msgstrMatch = block.match(/^msgstr "((?:\\"|[^"])*)"/m);

    if (msgstrMatch && msgstrMatch[1] === '') {
      empty += 1;
    }
  }

  return { empty, total };
};

const paths = process.argv.slice(2);

for (const path of paths) {
  console.log(path, countEmpty(path));
}
