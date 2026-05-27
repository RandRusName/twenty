import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import { getLocalizedSystemLabel } from './getLocalizedSystemLabel';

export const getLocalizedPageLayoutWidgetTitle = ({
  locale,
  title,
  widgetType: _widgetType,
}: {
  locale: AppLocale | string;
  title: string | null | undefined;
  widgetType?: string | null;
}): string => {
  if (!title) {
    return '';
  }

  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === SOURCE_LOCALE) {
    return title;
  }

  return (
    getLocalizedSystemLabel({
      locale,
      category: 'pageLayoutWidgets',
      key: title,
    }) ?? title
  );
};
