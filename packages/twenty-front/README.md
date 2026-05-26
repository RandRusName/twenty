Run `yarn dev` while server running on port `3000`

## Internationalization (Lingui)

Extract and compile UI strings for `twenty-front` only (catalog scope: `src/`):

```bash
yarn workspace twenty-front i18n:extract
yarn workspace twenty-front i18n:compile
```

Nx equivalents: `npx nx run twenty-front:lingui:extract` and `npx nx run twenty-front:lingui:compile`.

Test locales in the app with `?locale=ru-RU` or `?locale=en`.