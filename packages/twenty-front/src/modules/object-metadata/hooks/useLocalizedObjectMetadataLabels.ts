import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { useAppLocale } from '@/localization/hooks/useAppLocale';
import { useMemo } from 'react';
import {
  getCreateRecordLabel,
  getLocalizedObjectMetadataLabels,
} from 'twenty-shared/translations';

export const useLocalizedObjectMetadataLabels = (
  objectMetadataItem: EnrichedObjectMetadataItem,
) => {
  const locale = useAppLocale();

  return useMemo(() => {
    const localizedLabels = getLocalizedObjectMetadataLabels({
      locale,
      objectMetadataItem,
    });

    return {
      ...localizedLabels,
      createRecordLabel: getCreateRecordLabel({
        locale,
        objectMetadataItem,
      }),
    };
  }, [locale, objectMetadataItem]);
};
