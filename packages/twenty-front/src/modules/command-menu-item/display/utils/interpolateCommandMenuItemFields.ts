import { type CommandMenuContextApi, type Nullable } from 'twenty-shared/types';
import { getLocalizedCommandMenuItemDisplayFields } from 'twenty-shared/translations/system-labels';
import { interpolateCommandMenuItemTemplate } from 'twenty-shared/utils';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

type InterpolatedCommandMenuItemFields = {
  iconKey: Nullable<string>;
  label: string;
  shortLabel: Nullable<string>;
};

export const interpolateCommandMenuItemFields = (
  item: CommandMenuItemFieldsFragment,
  commandMenuContextApi: CommandMenuContextApi,
  locale: string,
): InterpolatedCommandMenuItemFields => {
  const iconKey = interpolateCommandMenuItemTemplate({
    label: item.icon,
    context: commandMenuContextApi,
  });

  const interpolatedLabel =
    interpolateCommandMenuItemTemplate({
      label: item.label,
      context: commandMenuContextApi,
    }) ?? item.label;

  const interpolatedShortLabel = interpolateCommandMenuItemTemplate({
    label: item.shortLabel,
    context: commandMenuContextApi,
  });

  const { label, shortLabel } = getLocalizedCommandMenuItemDisplayFields({
    locale,
    engineComponentKey: item.engineComponentKey,
    commandMenuContextApi: commandMenuContextApi as Record<string, unknown>,
    label: interpolatedLabel,
    shortLabel: interpolatedShortLabel,
  });

  return { iconKey, label, shortLabel };
};
