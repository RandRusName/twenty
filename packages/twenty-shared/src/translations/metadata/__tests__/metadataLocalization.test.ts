import { getCreateRecordLabel } from '../getCreateRecordLabel';
import { getLocalizedFieldMetadataLabel } from '../getLocalizedFieldMetadataLabel';
import { getLocalizedObjectMetadataLabels } from '../getLocalizedObjectMetadataLabels';

const companyObjectMetadataItem = {
  nameSingular: 'company',
  labelSingular: 'Company',
  labelPlural: 'Companies',
  isCustom: false,
};

const customObjectMetadataItem = {
  nameSingular: 'laboratory',
  labelSingular: 'Laboratory',
  labelPlural: 'Laboratories',
  isCustom: true,
};

describe('getLocalizedObjectMetadataLabels', () => {
  it('should return Russian labels for company when locale is ru-RU', () => {
    expect(
      getLocalizedObjectMetadataLabels({
        locale: 'ru-RU',
        objectMetadataItem: companyObjectMetadataItem,
      }),
    ).toEqual({
      labelSingular: 'Компания',
      labelPlural: 'Компании',
      accusativeSingular: 'компанию',
    });
  });

  it('should return raw metadata labels for company when locale is en', () => {
    expect(
      getLocalizedObjectMetadataLabels({
        locale: 'en',
        objectMetadataItem: companyObjectMetadataItem,
      }),
    ).toEqual({
      labelSingular: 'Company',
      labelPlural: 'Companies',
      accusativeSingular: 'Company',
    });
  });

  it('should preserve customized labels for standard objects in source locale', () => {
    const customizedCompany = {
      nameSingular: 'company',
      labelSingular: 'Organization',
      labelPlural: 'Organizations',
      isCustom: false,
    };

    expect(
      getLocalizedObjectMetadataLabels({
        locale: 'en',
        objectMetadataItem: customizedCompany,
      }),
    ).toEqual({
      labelSingular: 'Organization',
      labelPlural: 'Organizations',
      accusativeSingular: 'Organization',
    });
  });

  it('should fall back to raw metadata labels for locales without translations', () => {
    const customizedCompany = {
      nameSingular: 'company',
      labelSingular: 'Organization',
      labelPlural: 'Organizations',
      isCustom: false,
    };

    expect(
      getLocalizedObjectMetadataLabels({
        locale: 'fr-FR',
        objectMetadataItem: customizedCompany,
      }),
    ).toEqual({
      labelSingular: 'Organization',
      labelPlural: 'Organizations',
      accusativeSingular: 'Organization',
    });
  });

  it('should use dictionary labels for renamed standard objects when locale is ru-RU', () => {
    const renamedCompany = {
      nameSingular: 'company',
      labelSingular: 'Organization',
      labelPlural: 'Organizations',
      isCustom: false,
    };

    expect(
      getLocalizedObjectMetadataLabels({
        locale: 'ru-RU',
        objectMetadataItem: renamedCompany,
      }),
    ).toEqual({
      labelSingular: 'Компания',
      labelPlural: 'Компании',
      accusativeSingular: 'компанию',
    });
  });

  it('should return raw metadata labels for custom objects', () => {
    expect(
      getLocalizedObjectMetadataLabels({
        locale: 'ru-RU',
        objectMetadataItem: customObjectMetadataItem,
      }),
    ).toEqual({
      labelSingular: 'Laboratory',
      labelPlural: 'Laboratories',
      accusativeSingular: 'Laboratory',
    });
  });
});

describe('getLocalizedFieldMetadataLabel', () => {
  it('should return Russian field label for company.name', () => {
    expect(
      getLocalizedFieldMetadataLabel({
        locale: 'ru-RU',
        objectNameSingular: 'company',
        fieldMetadataItem: {
          name: 'name',
          label: 'Name',
          isCustom: false,
        },
      }),
    ).toBe('Название компании');
  });

  it('should return raw field label for unknown fields', () => {
    expect(
      getLocalizedFieldMetadataLabel({
        locale: 'ru-RU',
        objectNameSingular: 'company',
        fieldMetadataItem: {
          name: 'unknownField',
          label: 'Custom Field',
          isCustom: false,
        },
      }),
    ).toBe('Custom Field');
  });

  it('should return raw field label for custom fields', () => {
    expect(
      getLocalizedFieldMetadataLabel({
        locale: 'ru-RU',
        objectNameSingular: 'company',
        fieldMetadataItem: {
          name: 'experimentCode',
          label: 'Experiment Code',
          isCustom: true,
        },
      }),
    ).toBe('Experiment Code');
  });
});

describe('getCreateRecordLabel', () => {
  it('should return Russian create label for company', () => {
    expect(
      getCreateRecordLabel({
        locale: 'ru-RU',
        objectMetadataItem: companyObjectMetadataItem,
      }),
    ).toBe('Создать компанию');
  });

  it('should return English create label for company', () => {
    expect(
      getCreateRecordLabel({
        locale: 'en',
        objectMetadataItem: companyObjectMetadataItem,
      }),
    ).toBe('New Company');
  });

  it('should use customized source-locale label in create record label', () => {
    expect(
      getCreateRecordLabel({
        locale: 'en',
        objectMetadataItem: {
          nameSingular: 'company',
          labelSingular: 'Organization',
          labelPlural: 'Organizations',
          isCustom: false,
        },
      }),
    ).toBe('New Organization');
  });
});

describe('twenty-shared/translations package exports', () => {
  it('should expose metadata localization helpers from the package barrel', async () => {
    const translations = await import('twenty-shared/translations');

    expect(translations.getLocalizedObjectMetadataLabels).toBeDefined();
    expect(translations.getLocalizedFieldMetadataLabel).toBeDefined();
    expect(translations.getCreateRecordLabel).toBeDefined();
  });
});
