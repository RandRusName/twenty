import { getLocalizedCommandMenuItemDisplayFields } from '../getLocalizedCommandMenuItemDisplayFields';
import { getLocalizedFieldGroupName } from '../getLocalizedFieldGroupName';
import { getLocalizedFolderNavigationName } from '../getLocalizedFolderNavigationName';
import { getLocalizedPageLayoutWidgetTitle } from '../getLocalizedPageLayoutWidgetTitle';
import { getLocalizedViewName } from '../getLocalizedViewName';

describe('getLocalizedFieldGroupName', () => {
  it('should return Russian label for General when locale is ru-RU', () => {
    expect(
      getLocalizedFieldGroupName({
        locale: 'ru-RU',
        groupName: 'General',
      }),
    ).toBe('Основное');
  });

  it('should return Russian label for Work when locale is ru-RU', () => {
    expect(
      getLocalizedFieldGroupName({
        locale: 'ru-RU',
        groupName: 'Work',
      }),
    ).toBe('Работа');
  });

  it('should return Russian label for Social when locale is ru-RU', () => {
    expect(
      getLocalizedFieldGroupName({
        locale: 'ru-RU',
        groupName: 'Social',
      }),
    ).toBe('Соцсети');
  });

  it('should return unchanged label for en locale', () => {
    expect(
      getLocalizedFieldGroupName({
        locale: 'en',
        groupName: 'General',
      }),
    ).toBe('General');
  });

  it('should return custom group name unchanged', () => {
    expect(
      getLocalizedFieldGroupName({
        locale: 'ru-RU',
        groupName: 'Custom Group',
      }),
    ).toBe('Custom Group');
  });
});

describe('getLocalizedViewName', () => {
  it('should return Russian label for Workflows view name', () => {
    expect(
      getLocalizedViewName({
        locale: 'ru-RU',
        view: { name: 'Workflows' },
      }),
    ).toBe('Процессы');
  });
});

describe('getLocalizedFolderNavigationName', () => {
  it('should return Russian label for Workflows folder', () => {
    expect(
      getLocalizedFolderNavigationName({
        locale: 'ru-RU',
        name: 'Workflows',
      }),
    ).toBe('Процессы');
  });
});

describe('getLocalizedPageLayoutWidgetTitle', () => {
  it('should return Russian label for Fields widget title', () => {
    expect(
      getLocalizedPageLayoutWidgetTitle({
        locale: 'ru-RU',
        title: 'Fields',
      }),
    ).toBe('Поля');
  });
});

describe('twenty-shared/translations/system-labels package exports', () => {
  it('should expose system-label helpers from the subpath entrypoint', async () => {
    const systemLabels = await import('twenty-shared/translations/system-labels');

    expect(systemLabels.getLocalizedViewName).toBeDefined();
    expect(systemLabels.getLocalizedFieldGroupName).toBeDefined();
    expect(systemLabels.getLocalizedCommandMenuItemDisplayFields).toBeDefined();
  });
});

describe('getLocalizedCommandMenuItemDisplayFields', () => {
  const taskObjectMetadataItem = {
    nameSingular: 'task',
    labelSingular: 'Task',
    labelPlural: 'Tasks',
    isCustom: false,
  };

  it('should return Russian create label for CREATE_NEW_RECORD', () => {
    expect(
      getLocalizedCommandMenuItemDisplayFields({
        locale: 'ru-RU',
        engineComponentKey: 'CREATE_NEW_RECORD',
        commandMenuContextApi: {
          objectMetadataItem: taskObjectMetadataItem,
        },
        label: 'Create new Task',
        shortLabel: 'New Task',
      }),
    ).toEqual({
      label: 'Создать задачу',
      shortLabel: 'Создать задачу',
    });
  });

  it('should not localize a non-create command that starts with "New ..."', () => {
    expect(
      getLocalizedCommandMenuItemDisplayFields({
        locale: 'ru-RU',
        engineComponentKey: 'SOME_OTHER_COMMAND_KEY',
        commandMenuContextApi: {
          objectMetadataItem: taskObjectMetadataItem,
        },
        label: 'New Task',
        shortLabel: 'New Task',
      }),
    ).toEqual({
      label: 'New Task',
      shortLabel: 'New Task',
    });
  });

  it('should use legacy regex fallback only when engineComponentKey is missing', () => {
    expect(
      getLocalizedCommandMenuItemDisplayFields({
        locale: 'ru-RU',
        engineComponentKey: null,
        commandMenuContextApi: {
          objectMetadataItem: taskObjectMetadataItem,
        },
        label: 'New Task',
        shortLabel: 'New Task',
      }),
    ).toEqual({
      label: 'Создать задачу',
      shortLabel: 'Создать задачу',
    });
  });

  it('should return English create label for CREATE_NEW_RECORD when locale is en', () => {
    expect(
      getLocalizedCommandMenuItemDisplayFields({
        locale: 'en',
        engineComponentKey: 'CREATE_NEW_RECORD',
        commandMenuContextApi: {
          objectMetadataItem: taskObjectMetadataItem,
        },
        label: 'Create new Task',
        shortLabel: 'New Task',
      }),
    ).toEqual({
      label: 'New Task',
      shortLabel: 'New Task',
    });
  });
});
