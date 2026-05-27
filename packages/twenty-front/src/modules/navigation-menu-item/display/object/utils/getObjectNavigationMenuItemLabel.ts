import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import {
  getLocalizedObjectMetadataLabels,
  type AppLocale,
} from 'twenty-shared/translations';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

export const getObjectNavigationMenuItemLabel = (
  item: Pick<NavigationMenuItem, 'targetObjectMetadataId'>,
  objectMetadataItems: Pick<
    EnrichedObjectMetadataItem,
    'id' | 'labelPlural' | 'labelSingular' | 'nameSingular' | 'isCustom'
  >[],
  locale: AppLocale | string,
): string => {
  const objectMetadataItem = objectMetadataItems.find(
    (meta) => meta.id === item.targetObjectMetadataId,
  );

  if (!objectMetadataItem) {
    return '';
  }

  return getLocalizedObjectMetadataLabels({
    locale,
    objectMetadataItem,
  }).labelPlural;
};
