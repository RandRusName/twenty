import { type AppLocale } from '@/translations/constants/AppLocales';
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

  if (fieldMetadataItem.isCustom === true) {
    return fallbackLabel;
  }

  const fieldName = fieldMetadataItem.name;

  if (!objectNameSingular || !fieldName) {
    return fallbackLabel;
  }

  const normalizedLocale = normalizeLocale(locale);
  const translationKey = getStandardFieldMetadataTranslationKey(
    objectNameSingular,
    fieldName,
  );
  const translation =
    STANDARD_FIELD_METADATA_TRANSLATIONS[normalizedLocale]?.[translationKey];

  return translation ?? fallbackLabel;
};
