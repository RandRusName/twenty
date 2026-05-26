import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type FieldDefinition } from '@/object-record/record-field/ui/types/FieldDefinition';
import { type FieldMetadata } from '@/object-record/record-field/ui/types/FieldMetadata';

import { getFieldButtonIcon } from '@/object-record/record-field/ui/utils/getFieldButtonIcon';
import { i18n } from '@lingui/core';
import { FieldMetadataType } from 'twenty-shared/types';
import { getLocalizedFieldMetadataLabel } from 'twenty-shared/translations';
import { normalizeLocale } from 'twenty-shared/utils';
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';

export type FieldMetadataItemAsFieldDefinitionProps = {
  field: FieldMetadataItem;
  objectMetadataItem: EnrichedObjectMetadataItem;
  showLabel?: boolean;
  labelWidth?: number;
};

export const formatFieldMetadataItemAsFieldDefinition = ({
  field,
  objectMetadataItem,
  showLabel,
  labelWidth,
}: FieldMetadataItemAsFieldDefinitionProps): FieldDefinition<FieldMetadata> => {
  const relationObjectMetadataItem = field.relation?.targetObjectMetadata;

  const relationFieldMetadataId = field.relation?.targetFieldMetadata.id;

  const isRelation = field.type === FieldMetadataType.RELATION;
  const isMorphRelation = field.type === FieldMetadataType.MORPH_RELATION;

  const relationType = isRelation
    ? field.relation?.type
    : isMorphRelation
      ? field.morphRelations?.[0]?.type
      : undefined;

  const localizedFieldLabel = getLocalizedFieldMetadataLabel({
    locale: normalizeLocale(i18n.locale),
    objectNameSingular: objectMetadataItem.nameSingular,
    fieldMetadataItem: field,
  });

  const fieldDefintionMetadata = {
    fieldName: field.name,
    placeHolder: localizedFieldLabel,
    relationType,
    morphRelations: isMorphRelation ? field.morphRelations : [],
    relationFieldMetadataId,
    relationObjectMetadataNameSingular:
      relationObjectMetadataItem?.nameSingular ?? '',
    relationObjectMetadataNamePlural:
      relationObjectMetadataItem?.namePlural ?? '',
    relationObjectMetadataId: relationObjectMetadataItem?.id ?? '',
    objectMetadataNameSingular: objectMetadataItem.nameSingular ?? '',
    targetFieldMetadataName: field.relation?.targetFieldMetadata?.name ?? '',
    options: field.options,
    settings: field.settings,
    isNullable: field.isNullable,
    isCustom: field.isCustom ?? false,
    isUIReadOnly: field.isUIReadOnly ?? false,
  };

  return {
    fieldMetadataId: field.id,
    label: localizedFieldLabel,
    showLabel,
    labelWidth,
    type: field.type,
    metadata: fieldDefintionMetadata,
    iconName: field.icon ?? 'Icon123',
    defaultValue: field.defaultValue,
    editButtonIcon: getFieldButtonIcon({
      metadata: fieldDefintionMetadata,
      type: field.type,
    }),
  };
};
