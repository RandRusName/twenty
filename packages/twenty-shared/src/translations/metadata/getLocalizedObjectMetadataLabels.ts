import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import { STANDARD_OBJECT_METADATA_TRANSLATIONS } from './standardObjectMetadataTranslations';
import { type StandardObjectTranslation } from './types';

export type ObjectMetadataItemForLocalization = {
  nameSingular?: string | null;
  labelSingular?: string | null;
  labelPlural?: string | null;
  isCustom?: boolean | null;
};

export type LocalizedObjectMetadataLabels = {
  labelSingular: string;
  labelPlural: string;
  accusativeSingular: string;
};

const getFallbackLabels = (
  objectMetadataItem: ObjectMetadataItemForLocalization,
): LocalizedObjectMetadataLabels => ({
  labelSingular: objectMetadataItem.labelSingular ?? '',
  labelPlural: objectMetadataItem.labelPlural ?? '',
  accusativeSingular: objectMetadataItem.labelSingular ?? '',
});

export const getLocalizedObjectMetadataLabels = ({
  locale,
  objectMetadataItem,
}: {
  locale: AppLocale | string;
  objectMetadataItem: ObjectMetadataItemForLocalization;
}): LocalizedObjectMetadataLabels => {
  const fallbackLabels = getFallbackLabels(objectMetadataItem);
  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === SOURCE_LOCALE) {
    return fallbackLabels;
  }

  // Standard objects use the locale dictionary when an entry exists, even if the
  // workspace renamed labelSingular/labelPlural in metadata (isCustom stays false).
  if (objectMetadataItem.isCustom === true) {
    return fallbackLabels;
  }

  const objectNameSingular = objectMetadataItem.nameSingular;

  if (!objectNameSingular) {
    return fallbackLabels;
  }

  const translation =
    STANDARD_OBJECT_METADATA_TRANSLATIONS[normalizedLocale]?.[
      objectNameSingular
    ];

  if (!translation) {
    return fallbackLabels;
  }

  return mergeTranslationWithFallback(translation, fallbackLabels);
};

const mergeTranslationWithFallback = (
  translation: StandardObjectTranslation,
  fallbackLabels: LocalizedObjectMetadataLabels,
): LocalizedObjectMetadataLabels => ({
  labelSingular: translation.labelSingular || fallbackLabels.labelSingular,
  labelPlural: translation.labelPlural || fallbackLabels.labelPlural,
  accusativeSingular:
    translation.accusativeSingular || fallbackLabels.accusativeSingular,
});
