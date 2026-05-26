import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSearchInput } from '@/ui/layout/dropdown/components/DropdownMenuSearchInput';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { getTranslatedThemeColorLabels } from '@/ui/input/utils/getTranslatedThemeColorLabels';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useMemo, useState } from 'react';
import { MenuItemSelectColor } from 'twenty-ui/navigation';
import { type ThemeColor, MAIN_COLOR_NAMES } from 'twenty-ui/theme';

type ThemeColorPickerMenuProps = {
  selectedColor: ThemeColor;
  onSelectColor: (color: ThemeColor) => void;
};

export const ThemeColorPickerMenu = ({
  selectedColor,
  onSelectColor,
}: ThemeColorPickerMenuProps) => {
  const { i18n, t } = useLingui();
  const [searchValue, setSearchValue] = useState('');
  const colorLabels = useMemo(
    () => getTranslatedThemeColorLabels(i18n),
    [i18n],
  );

  const query = searchValue.trim().toLowerCase();

  const filteredColorNames = isNonEmptyString(query)
    ? MAIN_COLOR_NAMES.filter(
        (colorName) =>
          colorName.toLowerCase().includes(query) ||
          (colorLabels[colorName] ?? '').toLowerCase().includes(query),
      )
    : MAIN_COLOR_NAMES;

  return (
    <>
      <DropdownMenuSearchInput
        placeholder={t`Search colors...`}
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />
      <DropdownMenuSeparator />
      <DropdownMenuItemsContainer hasMaxHeight>
        {filteredColorNames.map((colorName) => (
          <MenuItemSelectColor
            key={colorName}
            onClick={() => onSelectColor(colorName)}
            color={colorName}
            selected={colorName === selectedColor}
            colorLabels={colorLabels}
          />
        ))}
      </DropdownMenuItemsContainer>
    </>
  );
};
