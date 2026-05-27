import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import { STANDARD_SYSTEM_LABEL_TRANSLATIONS } from './standardSystemLabelTranslations';

export const getLocalizedFolderNavigationName = ({
  locale,
  name,
}: {
  locale: AppLocale | string;
  name: string | null | undefined;
}): string => {
  if (!name) {
    return '';
  }

  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === SOURCE_LOCALE) {
    return name;
  }

  const folderTranslations =
    STANDARD_SYSTEM_LABEL_TRANSLATIONS['ru-RU']?.navigation.folders;

  if (folderTranslations && name in folderTranslations) {
    return folderTranslations[name as keyof typeof folderTranslations];
  }

  return name;
};
