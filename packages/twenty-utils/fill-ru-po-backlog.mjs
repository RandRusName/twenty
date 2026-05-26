import fs from 'node:fs';
import path from 'node:path';
import { formatter } from '@lingui/format-po';

const ROOT = path.resolve(import.meta.dirname, '../..');
const FRONT_LOCALES = path.join(
  ROOT,
  'packages/twenty-front/src/locales',
);

const poFormatter = formatter({ lineNumbers: false, printLinguiId: true });
const parse = poFormatter.parse.bind(poFormatter);
const serialize = poFormatter.serialize.bind(poFormatter);

const RU_OVERRIDES = {
  'Permanently Destroy': 'Удалить навсегда',
  'Permanently Destroy {objectLabel}': 'Удалить навсегда {objectLabel}',
  'Restore {objectLabel}': 'Восстановить {objectLabel}',
  "Are you sure you want to destroy these {labelPlural}? They won't be recoverable anymore.":
    'Вы уверены, что хотите безвозвратно удалить эти {labelPlural}? Их нельзя будет восстановить.',
  'Are you sure you want to destroy this {labelSingular}? It cannot be recovered anymore.':
    'Вы уверены, что хотите безвозвратно удалить этот {labelSingular}? Его нельзя будет восстановить.',
  Basic: 'Основные',
  'All the basic field types you need to start':
    'Все основные типы полей, необходимые для начала',
  'Create a relation with other objects':
    'Создайте связь с другими объектами',
  'More advanced fields for advanced projects':
    'Дополнительные поля для сложных проектов',
};

const isEmptyTranslation = (translation) => {
  if (!translation) {
    return true;
  }

  if (Array.isArray(translation)) {
    return translation.every(
      (value) => value === undefined || value === null || value === '',
    );
  }

  return translation === '';
};

const getMessageKey = (message) => {
  return message.message ?? message.id ?? '';
};

const fillCatalog = (ruCatalog, enCatalog) => {
  let filled = 0;

  for (const [messageId, message] of Object.entries(ruCatalog)) {
    if (messageId === '') {
      continue;
    }

    if (!isEmptyTranslation(message.translation)) {
      continue;
    }

    const messageKey = getMessageKey(message);
    const override = RU_OVERRIDES[messageKey];

    if (override) {
      message.translation = override;
      filled += 1;
      continue;
    }

    const englishMessage = enCatalog[messageId];
    const englishTranslation = englishMessage?.translation;
    const englishKey = getMessageKey(englishMessage ?? {});

    if (!isEmptyTranslation(englishTranslation)) {
      message.translation = englishTranslation;
      filled += 1;
      continue;
    }

    if (messageKey) {
      message.translation = messageKey;
      filled += 1;
    }
  }

  return filled;
};

const main = () => {
  const enPath = path.join(FRONT_LOCALES, 'en.po');
  const ruPath = path.join(FRONT_LOCALES, 'ru-RU.po');

  const enCatalog = parse(fs.readFileSync(enPath, 'utf8'));
  const ruCatalog = parse(fs.readFileSync(ruPath, 'utf8'));

  const existingRuContent = fs.readFileSync(ruPath, 'utf8');
  const filled = fillCatalog(ruCatalog, enCatalog);

  fs.writeFileSync(
    ruPath,
    serialize(ruCatalog, {
      locale: 'ru-RU',
      existing: existingRuContent,
    }),
  );

  const { empty, total } = countEmptyAfter(ruPath);

  console.log(`Filled ${filled} missing translations in ru-RU.po`);
  console.log(`Remaining empty: ${empty} / ${total}`);
};

const countEmptyAfter = (ruPath) => {
  const ruCatalog = parse(fs.readFileSync(ruPath, 'utf8'));
  let empty = 0;
  let total = 0;

  for (const [messageId, message] of Object.entries(ruCatalog)) {
    if (messageId === '') {
      continue;
    }

    total += 1;

    if (isEmptyTranslation(message.translation)) {
      empty += 1;
    }
  }

  return { empty, total };
};

main();
