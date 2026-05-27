import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import {
  STANDARD_SYSTEM_LABEL_TRANSLATIONS,
  type StandardSystemLabelLocale,
  type StandardSystemLabelCategory,
} from './standardSystemLabelTranslations';

const isSupportedLocale = (
  locale: string,
): locale is StandardSystemLabelLocale => locale in STANDARD_SYSTEM_LABEL_TRANSLATIONS;

export const getLocalizedSystemLabel = ({
  locale,
  category,
  key,
}: {
  locale: AppLocale | string;
  category: StandardSystemLabelCategory;
  key: string;
}): string | undefined => {
  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === SOURCE_LOCALE) {
    return undefined;
  }

  if (!isSupportedLocale(normalizedLocale)) {
    return undefined;
  }

  const categoryTranslations =
    STANDARD_SYSTEM_LABEL_TRANSLATIONS[normalizedLocale][category];

  if (!(key in categoryTranslations)) {
    return undefined;
  }

  return categoryTranslations[key as keyof typeof categoryTranslations];
};
