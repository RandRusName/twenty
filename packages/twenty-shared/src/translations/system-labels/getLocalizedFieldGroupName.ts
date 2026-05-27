import { type AppLocale } from '@/translations/constants/AppLocales';
import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';
import { normalizeLocale } from '@/utils/validation/normalizeLocale';

import { getLocalizedSystemLabel } from './getLocalizedSystemLabel';

// TODO: distinguish system vs user-created group names when backend provides a flag.
export const getLocalizedFieldGroupName = ({
  locale,
  groupName,
  objectNameSingular: _objectNameSingular,
}: {
  locale: AppLocale | string;
  groupName: string;
  objectNameSingular?: string | null;
}): string => {
  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === SOURCE_LOCALE) {
    return groupName;
  }

  return (
    getLocalizedSystemLabel({
      locale,
      category: 'fieldGroups',
      key: groupName,
    }) ?? groupName
  );
};
