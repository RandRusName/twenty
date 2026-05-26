import { msg } from '@lingui/core/macro';
import { type I18n } from '@lingui/core';
import { type SettingsFieldType } from '@/settings/data-model/types/SettingsFieldType';
import { FieldMetadataType } from '~/generated-metadata/graphql';

const settingsFieldTypeLabelMessages: Record<SettingsFieldType, ReturnType<typeof msg>> = {
  [FieldMetadataType.UUID]: msg`Unique ID`,
  [FieldMetadataType.TEXT]: msg`Text`,
  [FieldMetadataType.NUMBER]: msg`Number`,
  [FieldMetadataType.BOOLEAN]: msg`True/False`,
  [FieldMetadataType.DATE_TIME]: msg`Date and Time`,
  [FieldMetadataType.DATE]: msg`Date`,
  [FieldMetadataType.SELECT]: msg`Select`,
  [FieldMetadataType.MULTI_SELECT]: msg`Multi-select`,
  [FieldMetadataType.RELATION]: msg`Relation`,
  [FieldMetadataType.MORPH_RELATION]: msg`Morph Relation`,
  [FieldMetadataType.RATING]: msg`Rating`,
  [FieldMetadataType.RAW_JSON]: msg`JSON`,
  [FieldMetadataType.ARRAY]: msg`Array`,
  [FieldMetadataType.FILES]: msg`Files`,
  [FieldMetadataType.CURRENCY]: msg`Currency`,
  [FieldMetadataType.EMAILS]: msg`Emails`,
  [FieldMetadataType.LINKS]: msg`Links`,
  [FieldMetadataType.PHONES]: msg`Phones`,
  [FieldMetadataType.FULL_NAME]: msg`Full Name`,
  [FieldMetadataType.ADDRESS]: msg`Address`,
  [FieldMetadataType.ACTOR]: msg`Actor`,
  [FieldMetadataType.RICH_TEXT]: msg`Rich Text`,
};

export const getTranslatedSettingsFieldTypeLabel = (
  fieldType: SettingsFieldType,
  i18n: I18n,
): string => {
  const message = settingsFieldTypeLabelMessages[fieldType];

  return i18n._(message);
};
