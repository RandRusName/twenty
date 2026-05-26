import {
  formatFieldMetadataItemAsFieldDefinition,
  type FieldMetadataItemAsFieldDefinitionProps,
} from '@/object-metadata/utils/formatFieldMetadataItemAsFieldDefinition';
import { i18n } from '@lingui/core';
import { normalizeLocale } from 'twenty-shared/utils';

export const formatFieldMetadataItemAsFieldDefinitionWithCurrentLocale = (
  props: Omit<FieldMetadataItemAsFieldDefinitionProps, 'locale'>,
) => {
  return formatFieldMetadataItemAsFieldDefinition({
    ...props,
    locale: normalizeLocale(i18n.locale),
  });
};
