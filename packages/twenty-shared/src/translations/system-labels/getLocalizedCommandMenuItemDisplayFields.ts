import { type AppLocale } from '@/translations/constants/AppLocales';
import { type Nullable } from '@/types';
import { isDefined } from '@/utils/validation/isDefined';

import { getCreateRecordLabel } from '../metadata/getCreateRecordLabel';
import { type ObjectMetadataItemForLocalization } from '../metadata/getLocalizedObjectMetadataLabels';

const CREATE_NEW_RECORD_ENGINE_KEY = 'CREATE_NEW_RECORD';

const NEW_RECORD_LABEL_PATTERN = /^\+?\s*New\s+/i;

const isCreateRecordInterpolatedLabel = (label: string): boolean =>
  NEW_RECORD_LABEL_PATTERN.test(label);

const getObjectMetadataItemForLocalization = (
  objectMetadataItem: Record<string, unknown> | null | undefined,
): ObjectMetadataItemForLocalization | null => {
  if (!isDefined(objectMetadataItem) || typeof objectMetadataItem !== 'object') {
    return null;
  }

  const labelSingular = objectMetadataItem.labelSingular;
  const labelPlural = objectMetadataItem.labelPlural;
  const nameSingular = objectMetadataItem.nameSingular;

  if (
    typeof labelSingular !== 'string' ||
    typeof labelPlural !== 'string' ||
    typeof nameSingular !== 'string'
  ) {
    return null;
  }

  return {
    nameSingular,
    labelSingular,
    labelPlural,
    isCustom:
      typeof objectMetadataItem.isCustom === 'boolean'
        ? objectMetadataItem.isCustom
        : null,
  };
};

export const getLocalizedCommandMenuItemDisplayFields = ({
  locale,
  engineComponentKey,
  commandMenuContextApi,
  label,
  shortLabel,
}: {
  locale: AppLocale | string;
  engineComponentKey: Nullable<string>;
  commandMenuContextApi: Record<string, unknown>;
  label: string;
  shortLabel: Nullable<string>;
}): { label: string; shortLabel: Nullable<string> } => {
  const objectMetadataItem = getObjectMetadataItemForLocalization(
    commandMenuContextApi.objectMetadataItem as Record<string, unknown>,
  );

  const isCreateNewRecordCommand =
    engineComponentKey === CREATE_NEW_RECORD_ENGINE_KEY;

  const shouldLocalizeCreateLabel =
    isDefined(objectMetadataItem) &&
    (isCreateNewRecordCommand ||
      isCreateRecordInterpolatedLabel(label) ||
      (isDefined(shortLabel) && isCreateRecordInterpolatedLabel(shortLabel)));

  if (!shouldLocalizeCreateLabel) {
    return { label, shortLabel };
  }

  const createRecordLabel = getCreateRecordLabel({
    locale,
    objectMetadataItem,
  });

  const shouldLocalizeLabel =
    isCreateNewRecordCommand || isCreateRecordInterpolatedLabel(label);

  const shouldLocalizeShortLabel =
    isCreateNewRecordCommand ||
    (isDefined(shortLabel) && isCreateRecordInterpolatedLabel(shortLabel));

  return {
    label: shouldLocalizeLabel ? createRecordLabel : label,
    shortLabel: shouldLocalizeShortLabel ? createRecordLabel : shortLabel,
  };
};
