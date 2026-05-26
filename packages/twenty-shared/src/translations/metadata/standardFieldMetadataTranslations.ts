import { SOURCE_LOCALE } from '@/translations/constants/SourceLocale';

import { type StandardFieldMetadataTranslationsByLocale } from './types';

const buildFieldTranslationKey = (
  objectNameSingular: string,
  fieldName: string,
) => `${objectNameSingular}.${fieldName}`;

export const STANDARD_FIELD_METADATA_TRANSLATIONS: Record<
  string,
  StandardFieldMetadataTranslationsByLocale
> = {
  [SOURCE_LOCALE]: {},
  'ru-RU': {
    [buildFieldTranslationKey('company', 'name')]: 'Название компании',
    [buildFieldTranslationKey('company', 'domainName')]: 'Домен',
    [buildFieldTranslationKey('company', 'employees')]: 'Сотрудники',
    [buildFieldTranslationKey('company', 'address')]: 'Адрес',
    [buildFieldTranslationKey('company', 'linkedinLink')]: 'LinkedIn',
    [buildFieldTranslationKey('company', 'xLink')]: 'X',
    [buildFieldTranslationKey('company', 'annualRecurringRevenue')]: 'ARR',
    [buildFieldTranslationKey('company', 'idealCustomerProfile')]: 'ICP',
    [buildFieldTranslationKey('person', 'name')]: 'Имя',
    [buildFieldTranslationKey('person', 'emails')]: 'Email',
    [buildFieldTranslationKey('person', 'phones')]: 'Телефон',
    [buildFieldTranslationKey('person', 'jobTitle')]: 'Должность',
    [buildFieldTranslationKey('person', 'city')]: 'Город',
    [buildFieldTranslationKey('person', 'linkedinLink')]: 'LinkedIn',
    [buildFieldTranslationKey('person', 'xLink')]: 'X',
    [buildFieldTranslationKey('opportunity', 'name')]: 'Название сделки',
    [buildFieldTranslationKey('opportunity', 'amount')]: 'Сумма',
    [buildFieldTranslationKey('opportunity', 'closeDate')]: 'Дата закрытия',
    [buildFieldTranslationKey('opportunity', 'stage')]: 'Стадия',
    [buildFieldTranslationKey('task', 'title')]: 'Название задачи',
    [buildFieldTranslationKey('task', 'dueAt')]: 'Срок',
    [buildFieldTranslationKey('task', 'status')]: 'Статус',
    [buildFieldTranslationKey('task', 'bodyV2')]: 'Описание',
    [buildFieldTranslationKey('note', 'title')]: 'Заголовок',
    [buildFieldTranslationKey('note', 'bodyV2')]: 'Текст',
    [buildFieldTranslationKey('attachment', 'name')]: 'Название',
    [buildFieldTranslationKey('attachment', 'file')]: 'Файл',
    [buildFieldTranslationKey('calendarEvent', 'title')]: 'Название',
    [buildFieldTranslationKey('calendarEvent', 'startsAt')]: 'Начало',
    [buildFieldTranslationKey('calendarEvent', 'endsAt')]: 'Окончание',
    [buildFieldTranslationKey('message', 'subject')]: 'Тема',
    [buildFieldTranslationKey('message', 'text')]: 'Текст',
    [buildFieldTranslationKey('workflow', 'name')]: 'Название',
    [buildFieldTranslationKey('dashboard', 'title')]: 'Название',
  },
};

export const getStandardFieldMetadataTranslationKey = buildFieldTranslationKey;
