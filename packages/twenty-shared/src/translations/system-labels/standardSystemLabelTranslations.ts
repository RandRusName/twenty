// Runtime display labels for seeded/system metadata strings (not Lingui UI copy, not DB values).

export const STANDARD_SYSTEM_LABEL_TRANSLATIONS = {
  'ru-RU': {
    navigation: {
      folders: {
        Workflows: 'Процессы',
      },
    },
    views: {
      Workflows: 'Процессы',
      All: 'Все',
      Mine: 'Мои',
      My: 'Мои',
      Favorites: 'Избранное',
      RecentlyViewed: 'Недавно просмотренные',
      'Recently viewed': 'Недавно просмотренные',
    },
    pageLayoutWidgets: {
      Fields: 'Поля',
      Timeline: 'Лента',
      Notes: 'Заметки',
      Tasks: 'Задачи',
    },
    fieldGroups: {
      General: 'Основное',
      Work: 'Работа',
      Social: 'Соцсети',
      Other: 'Прочее',
    },
  },
} as const;

export type StandardSystemLabelLocale = keyof typeof STANDARD_SYSTEM_LABEL_TRANSLATIONS;

// Categories that exist under each supported locale (e.g. navigation, views, etc).
// Keeping this as a dedicated public type avoids tying helper signatures to a
// specific locale key like `'ru-RU'`.
export type StandardSystemLabelCategory =
  keyof (typeof STANDARD_SYSTEM_LABEL_TRANSLATIONS)[StandardSystemLabelLocale];
