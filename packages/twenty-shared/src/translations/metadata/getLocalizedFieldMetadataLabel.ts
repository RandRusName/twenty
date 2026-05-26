import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import { getStandardFieldMetadataTranslationKey } from './standardFieldMetadataTranslations';
import { STANDARD_FIELD_METADATA_TRANSLATIONS } from './standardFieldMetadataTranslations';

export type FieldMetadataItemForLocalization = {
  name?: string | null;
  label?: string | null;
  isCustom?: boolean | null;
};

export const getLocalizedFieldMetadataLabel = ({
  locale,
  objectNameSingular,
  fieldMetadataItem,
}: {
  locale: AppLocale | string;
  objectNameSingular?: string | null;
  fieldMetadataItem: FieldMetadataItemForLocalization;
}): string => {
  const fallbackLabel = fieldMetadataItem.label ?? '';
  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === SOURCE_LOCALE) {
    return fallbackLabel;
  }

  if (fieldMetadataItem.isCustom === true) {
    return fallbackLabel;
  }

  const fieldName = fieldMetadataItem.name;

  if (!objectNameSingular || !fieldName) {
    return fallbackLabel;
  }

  const translationKey = getStandardFieldMetadataTranslationKey(
    objectNameSingular,
    fieldName,
  );
  const translation =
    STANDARD_FIELD_METADATA_TRANSLATIONS[normalizedLocale]?.[translationKey];

  return translation ?? fallbackLabel;
};
