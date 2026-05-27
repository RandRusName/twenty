import { NavigationMenuItemType } from 'twenty-shared/types';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

import { useAppLocale } from '@/localization/hooks/useAppLocale';
import { getNavigationMenuItemLabel } from '@/navigation-menu-item/display/utils/getNavigationMenuItemLabel';
import { getLocalizedFolderNavigationName } from 'twenty-shared/translations/system-labels';
import { useSelectedNavigationMenuItemEditItem } from '@/navigation-menu-item/edit/hooks/useSelectedNavigationMenuItemEditItem';
import { useSelectedNavigationMenuItemEditItemObjectMetadata } from '@/navigation-menu-item/edit/hooks/useSelectedNavigationMenuItemEditItemObjectMetadata';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { viewsSelector } from '@/views/states/selectors/viewsSelector';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

const getLabelForItem = (
  item: NavigationMenuItem,
  objectMetadataItems: Parameters<typeof getNavigationMenuItemLabel>[1],
  views: Parameters<typeof getNavigationMenuItemLabel>[2],
  locale: Parameters<typeof getNavigationMenuItemLabel>[3],
  objectLabelSingular?: string | null,
): string => {
  switch (item.type) {
    case NavigationMenuItemType.FOLDER:
      return getLocalizedFolderNavigationName({
        locale,
        name: item.name ?? 'Folder',
      });
    case NavigationMenuItemType.LINK:
      return item.name ?? 'Link';
    case NavigationMenuItemType.OBJECT:
    case NavigationMenuItemType.VIEW:
      return (
        getNavigationMenuItemLabel(
          item,
          objectMetadataItems,
          views,
          locale,
        ) ||
        objectLabelSingular ||
        ''
      );
    default:
      return objectLabelSingular ?? '';
  }
};

export const useSelectedNavigationMenuItemEditItemLabel = () => {
  const locale = useAppLocale();
  const { selectedItem } = useSelectedNavigationMenuItemEditItem();
  const { selectedItemObjectMetadata } =
    useSelectedNavigationMenuItemEditItemObjectMetadata();
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const views = useAtomStateValue(viewsSelector);

  const selectedItemLabel = selectedItem
    ? getLabelForItem(
        selectedItem,
        objectMetadataItems,
        views,
        locale,
        selectedItemObjectMetadata?.labelSingular,
      )
    : null;

  return { selectedItemLabel };
};
