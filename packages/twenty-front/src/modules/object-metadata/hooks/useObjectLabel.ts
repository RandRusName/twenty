import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { useLocalizedObjectMetadataLabels } from '@/object-metadata/hooks/useLocalizedObjectMetadataLabels';

export const useObjectLabel = (
  objectMetadataItem: EnrichedObjectMetadataItem,
) => {
  const { labelSingular } = useLocalizedObjectMetadataLabels(objectMetadataItem);

  return labelSingular;
};
