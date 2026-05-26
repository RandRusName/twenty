import {
  getLocalizedObjectMetadataLabels,
  type ObjectMetadataItemForLocalization,
} from '@/translations/metadata';
import { type AppLocale } from '@/translations/constants/AppLocales';

export const resolveObjectMetadataLabel = ({
  objectMetadataItem,
  numberOfSelectedRecords,
  locale,
}: {
  objectMetadataItem: ObjectMetadataItemForLocalization & {
    labelSingular: string;
    labelPlural: string;
  };
  numberOfSelectedRecords: number;
  locale?: AppLocale | string;
}): string => {
  const localizedLabels = locale
    ? getLocalizedObjectMetadataLabels({ locale, objectMetadataItem })
    : {
        labelSingular: objectMetadataItem.labelSingular,
        labelPlural: objectMetadataItem.labelPlural,
      };

  return numberOfSelectedRecords === 1
    ? localizedLabels.labelSingular
    : localizedLabels.labelPlural;
};
