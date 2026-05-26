export type StandardObjectTranslation = {
  labelSingular: string;
  labelPlural: string;
  accusativeSingular: string;
};

export type StandardObjectMetadataTranslationsByLocale = Partial<
  Record<string, StandardObjectTranslation>
>;

export type StandardFieldMetadataTranslationsByLocale = Partial<
  Record<string, string>
>;
