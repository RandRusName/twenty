Run `yarn dev` while server running on port `3000`

## Internationalization (Lingui)

Extract and compile UI strings for `twenty-front` only (catalog scope: `src/`):

```bash
yarn workspace twenty-front i18n:extract
yarn workspace twenty-front i18n:compile
yarn workspace twenty-front i18n:check
```

Nx equivalents: `npx nx run twenty-front:lingui:extract` and `npx nx run twenty-front:lingui:compile`.

Test locales in the app with `?locale=ru-RU` or `?locale=en`.

### `twenty-ui` strings

`twenty-ui` does not run Lingui extract. User-visible text must be passed from `twenty-front` via props (`title`, `label`, `placeholder`, `colorLabels`, `emptyLabel`, etc.). Avoid adding English defaults in `twenty-ui` for copy that appears in the CRM UI.

To backfill missing Russian entries in `ru-RU.po` after Crowdin sync is unavailable:

```bash
node packages/twenty-utils/fill-ru-po-backlog.mjs
yarn workspace twenty-front i18n:compile
```

### Runtime overlay (system/data labels)

In addition to Lingui UI strings, the app also localizes some *runtime*
labels that are derived from metadata / seeded system values:

1. Lingui UI strings (compiled from `src/locales/*.po`)
2. Metadata labels (localized helpers from `twenty-shared/translations/metadata`)
3. System label overlay (seeded labels like "Workflows", widget titles, and
   group names via `twenty-shared/translations/system-labels`)

The overlay is intentionally string-based and does not mutate database
metadata.

Validation:

```bash
yarn workspace twenty-front i18n:check
npx jest packages/twenty-shared/src/translations/system-labels/__tests__/*.test.ts --config=packages/twenty-shared/jest.config.mjs
```