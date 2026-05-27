import { type MouseEvent } from 'react';

import { useAppLocale } from '@/localization/hooks/useAppLocale';
import { getAvatarType } from '@/object-metadata/utils/getAvatarType';
import { getLocalizedObjectMetadataLabels } from 'twenty-shared/translations/metadata';
import { Avatar } from 'twenty-ui/display';
import { MenuItemSuggestion } from 'twenty-ui/navigation';

type MentionMenuListItemProps = {
  recordId: string;
  objectNameSingular: string;
  label: string;
  imageUrl: string;
  objectLabelSingular: string;
  isSelected: boolean;
  onClick: () => void;
};

export const MentionMenuListItem = ({
  recordId,
  objectNameSingular,
  label,
  imageUrl,
  objectLabelSingular,
  isSelected,
  onClick,
}: MentionMenuListItemProps) => {
  const locale = useAppLocale();
  const localizedObjectLabelSingular = getLocalizedObjectMetadataLabels({
    locale,
    objectMetadataItem: {
      nameSingular: objectNameSingular,
      labelSingular: objectLabelSingular,
      labelPlural: objectLabelSingular,
      isCustom: false,
    },
  }).labelSingular;

  const handleClick = (event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    onClick();
  };

  return (
    <MenuItemSuggestion
      selected={isSelected}
      onClick={handleClick}
      text={label}
      contextualText={localizedObjectLabelSingular}
      contextualTextPosition="left"
      LeftIcon={() => (
        <Avatar
          placeholder={label}
          placeholderColorSeed={recordId}
          avatarUrl={imageUrl}
          type={getAvatarType(objectNameSingular) ?? 'rounded'}
          size="sm"
        />
      )}
    />
  );
};
