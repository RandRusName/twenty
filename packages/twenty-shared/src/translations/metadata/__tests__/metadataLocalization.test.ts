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

  it('should return English labels for company when locale is en', () => {
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
});
