import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import { getLocalizedObjectMetadataLabels } from './getLocalizedObjectMetadataLabels';
import { type ObjectMetadataItemForLocalization } from './getLocalizedObjectMetadataLabels';

export const getCreateRecordLabel = ({
  locale,
  objectMetadataItem,
}: {
  locale: AppLocale | string;
  objectMetadataItem: ObjectMetadataItemForLocalization;
}): string => {
  const { labelSingular, accusativeSingular } = getLocalizedObjectMetadataLabels(
    {
      locale,
      objectMetadataItem,
    },
  );

  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === 'ru-RU') {
    return `Создать ${accusativeSingular}`;
  }

  if (normalizedLocale === SOURCE_LOCALE) {
    return `New ${labelSingular}`;
  }

  return `New ${labelSingular}`;
};
