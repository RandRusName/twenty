import { type View } from '@/views/types/View';
import {
  getLocalizedViewName,
  type AppLocale,
} from 'twenty-shared/translations';
import { isDefined } from 'twenty-shared/utils';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

export const getViewNavigationMenuItemLabel = (
  item: Pick<NavigationMenuItem, 'viewId'>,
  views: Pick<View, 'id' | 'name' | 'objectMetadataId' | 'key'>[],
  locale: AppLocale | string,
): string => {
  const view = views.find((view) => view.id === item.viewId);

  if (!isDefined(view)) {
    return '';
  }

  return getLocalizedViewName({ locale, view });
};
