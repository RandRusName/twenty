import { msg } from '@lingui/core/macro';
import { type I18n } from '@lingui/core';
import { type ColorLabels } from 'twenty-ui/navigation';
import { MAIN_COLOR_NAMES, type ThemeColor } from 'twenty-ui/theme';

const themeColorLabelMessages: Record<ThemeColor, ReturnType<typeof msg>> = {
  gray: msg`Gray`,
  tomato: msg`Tomato`,
  red: msg`Red`,
  ruby: msg`Ruby`,
  crimson: msg`Crimson`,
  pink: msg`Pink`,
  plum: msg`Plum`,
  purple: msg`Purple`,
  violet: msg`Violet`,
  iris: msg`Iris`,
  cyan: msg`Cyan`,
  turquoise: msg`Turquoise`,
  sky: msg`Sky`,
  blue: msg`Blue`,
  jade: msg`Jade`,
  green: msg`Green`,
  grass: msg`Grass`,
  mint: msg`Mint`,
  lime: msg`Lime`,
  bronze: msg`Bronze`,
  gold: msg`Gold`,
  brown: msg`Brown`,
  orange: msg`Orange`,
  amber: msg`Amber`,
  yellow: msg`Yellow`,
};

export const getTranslatedThemeColorLabels = (i18n: I18n): ColorLabels => {
  return MAIN_COLOR_NAMES.reduce<ColorLabels>((colorLabels, colorName) => {
    colorLabels[colorName] = i18n._(themeColorLabelMessages[colorName]);

    return colorLabels;
  }, {} as ColorLabels);
};
