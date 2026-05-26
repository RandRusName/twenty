import { i18n } from '@lingui/core';
import { useSyncExternalStore } from 'react';
import { type AppLocale } from 'twenty-shared/translations';
import { normalizeLocale } from 'twenty-shared/utils';

const subscribeToLocaleChanges = (onStoreChange: () => void) => {
  const unsubscribe = i18n.on('change', onStoreChange);

  return () => {
    unsubscribe();
  };
};

const getLocaleSnapshot = () => normalizeLocale(i18n.locale);

export const useAppLocale = (): AppLocale => {
  return useSyncExternalStore(
    subscribeToLocaleChanges,
    getLocaleSnapshot,
    getLocaleSnapshot,
  );
};
