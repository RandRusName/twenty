import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import { getLocalizedSystemLabel } from './getLocalizedSystemLabel';

export const getLocalizedViewName = ({
  locale,
  view,
}: {
  locale: AppLocale | string;
  view: { name: string; key?: string | null };
}): string => {
  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === SOURCE_LOCALE) {
    return view.name;
  }

  if (view.key) {
    const translationByKey = getLocalizedSystemLabel({
      locale,
      category: 'views',
      key: view.key,
    });

    if (translationByKey) {
      return translationByKey;
    }
  }

  return (
    getLocalizedSystemLabel({
      locale,
      category: 'views',
      key: view.name,
    }) ?? view.name
  );
};
