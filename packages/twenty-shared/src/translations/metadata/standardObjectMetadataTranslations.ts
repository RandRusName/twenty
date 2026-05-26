import { type StandardObjectMetadataTranslationsByLocale } from './types';

export const STANDARD_OBJECT_METADATA_TRANSLATIONS: Record<
  string,
  StandardObjectMetadataTranslationsByLocale
> = {
  'ru-RU': {
    company: {
      labelSingular: 'Компания',
      labelPlural: 'Компании',
      accusativeSingular: 'компанию',
    },
    person: {
      labelSingular: 'Контакт',
      labelPlural: 'Контакты',
      accusativeSingular: 'контакт',
    },
    opportunity: {
      labelSingular: 'Сделка',
      labelPlural: 'Сделки',
      accusativeSingular: 'сделку',
    },
    task: {
      labelSingular: 'Задача',
      labelPlural: 'Задачи',
      accusativeSingular: 'задачу',
    },
    note: {
      labelSingular: 'Заметка',
      labelPlural: 'Заметки',
      accusativeSingular: 'заметку',
    },
    attachment: {
      labelSingular: 'Вложение',
      labelPlural: 'Вложения',
      accusativeSingular: 'вложение',
    },
    calendarEvent: {
      labelSingular: 'Событие календаря',
      labelPlural: 'События календаря',
      accusativeSingular: 'событие календаря',
    },
    message: {
      labelSingular: 'Сообщение',
      labelPlural: 'Сообщения',
      accusativeSingular: 'сообщение',
    },
    workflow: {
      labelSingular: 'Процесс',
      labelPlural: 'Процессы',
      accusativeSingular: 'процесс',
    },
    dashboard: {
      labelSingular: 'Панель',
      labelPlural: 'Панели',
      accusativeSingular: 'панель',
    },
    workflowVersion: {
      labelSingular: 'Версия процесса',
      labelPlural: 'Версии процессов',
      accusativeSingular: 'версию процесса',
    },
    workflowRun: {
      labelSingular: 'Запуск процесса',
      labelPlural: 'Запуски процессов',
      accusativeSingular: 'запуск процесса',
    },
    workspaceMember: {
      labelSingular: 'Участник рабочей области',
      labelPlural: 'Участники рабочей области',
      accusativeSingular: 'участника рабочей области',
    },
    timelineActivity: {
      labelSingular: 'Активность',
      labelPlural: 'Активности',
      accusativeSingular: 'активность',
    },
    messageThread: {
      labelSingular: 'Цепочка сообщений',
      labelPlural: 'Цепочки сообщений',
      accusativeSingular: 'цепочку сообщений',
    },
  },
};
