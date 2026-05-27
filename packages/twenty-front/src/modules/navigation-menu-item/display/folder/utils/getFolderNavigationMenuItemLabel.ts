import { getLocalizedFolderNavigationName, type AppLocale } from 'twenty-shared/translations';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

export const getFolderNavigationMenuItemLabel = (
  item: Pick<NavigationMenuItem, 'name'>,
  locale: AppLocale | string,
): string => {
  const folderName = item.name ?? 'Folder';

  return getLocalizedFolderNavigationName({
    locale,
    name: folderName,
  });
};
