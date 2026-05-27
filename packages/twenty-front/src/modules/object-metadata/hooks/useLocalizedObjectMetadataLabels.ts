import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { useAppLocale } from '@/localization/hooks/useAppLocale';
import { useMemo } from 'react';
import {
  getCreateRecordLabel,
  getLocalizedObjectMetadataLabels,
} from 'twenty-shared/translations/metadata';

export const useLocalizedObjectMetadataLabels = (
  objectMetadataItem: EnrichedObjectMetadataItem,
) => {
  const locale = useAppLocale();
  const { nameSingular, labelSingular, labelPlural, isCustom } =
    objectMetadataItem;

  return useMemo(() => {
    const objectMetadataItemForLocalization = {
      nameSingular,
      labelSingular,
      labelPlural,
      isCustom,
    };
    const localizedLabels = getLocalizedObjectMetadataLabels({
      locale,
      objectMetadataItem: objectMetadataItemForLocalization,
    });

    return {
      ...localizedLabels,
      createRecordLabel: getCreateRecordLabel({
        locale,
        objectMetadataItem: objectMetadataItemForLocalization,
      }),
    };
  }, [locale, nameSingular, labelSingular, labelPlural, isCustom]);
};
