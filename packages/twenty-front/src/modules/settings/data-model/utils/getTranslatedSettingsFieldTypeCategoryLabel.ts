import { msg } from '@lingui/core/macro';
import { type I18n } from '@lingui/core';
import { type SettingsFieldTypeCategoryType } from '@/settings/data-model/types/SettingsFieldTypeCategoryType';

const settingsFieldTypeCategoryLabelMessages: Record<
  SettingsFieldTypeCategoryType,
  ReturnType<typeof msg>
> = {
  Basic: msg`Basic`,
  Relation: msg`Relation`,
  Advanced: msg`Advanced`,
};

const settingsFieldTypeCategoryDescriptionMessages: Record<
  SettingsFieldTypeCategoryType,
  ReturnType<typeof msg>
> = {
  Basic: msg`All the basic field types you need to start`,
  Advanced: msg`More advanced fields for advanced projects`,
  Relation: msg`Create a relation with other objects`,
};

export const getTranslatedSettingsFieldTypeCategoryLabel = (
  category: SettingsFieldTypeCategoryType,
  i18n: I18n,
): string => {
  return i18n._(settingsFieldTypeCategoryLabelMessages[category]);
};

export const getTranslatedSettingsFieldTypeCategoryDescription = (
  category: SettingsFieldTypeCategoryType,
  i18n: I18n,
): string => {
  return i18n._(settingsFieldTypeCategoryDescriptionMessages[category]);
};
