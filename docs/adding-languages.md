# Adding New Languages

This guide explains how to add new language translations to the application.

## Adding a Base Language (e.g., `fr`, `de`, `ja`)

1. **Create the translation file**
   - Copy `locales/en.json` to `locales/{lang}.json`
   - Replace `{lang}` with your ISO 639-1 language code

2. **Translate all strings**
   - Translate every string in the JSON file
   - Keep the same JSON structure
   - Don't change the keys, only the values

3. **Import the locale in client-side i18n**
   - Open `helpers/i18n.tsx`
   - Add import: `import {lang} from '../locales/{lang}.json'`
   - Add to `locales` object: `{lang}: {lang}`

4. **Import the locale in server-side i18n**
   - Open `helpers/i18n-server.ts`
   - Add import: `import {lang} from '../locales/{lang}.json'`
   - Add to `locales` object: `{lang}: {lang}`

5. **Test**
   - Restart dev server
   - Test API: `curl "localhost:3000/api?lang={lang}"`
   - Test UI: Change language in footer dropdown

## Adding a Regional Variant (e.g., `es-AR`, `pt-BR`, `en-GB`)

1. **Create the translation file**
   - Copy the base language file (e.g., `locales/es.json`)
   - Name it `locales/{lang}-{REGION}.json`
   - Use uppercase for region code

2. **Customize translations**
   - Modify strings to use regional slang, terms, or cultural references
   - Keep the same JSON structure

3. **Import the locale in client-side i18n**
   - Open `helpers/i18n.tsx`
   - Add import: `import {langREGION} from '../locales/{lang}-{REGION}.json'`
   - Add to `locales` object: `'{lang}-{REGION}': {langREGION}`
   - Note: Use quotes for keys with hyphens

4. **Import the locale in server-side i18n**
   - Open `helpers/i18n-server.ts`
   - Add import: `import {langREGION} from '../locales/{lang}-{REGION}.json'`
   - Add to `locales` object: `'{lang}-{REGION}': {langREGION}`
   - Note: Use quotes for keys with hyphens

5. **Test**
   - Restart dev server
   - Test API: `curl "localhost:3000/api?lang={lang}-{REGION}"`
   - Test fallback: `curl "localhost:3000/api?lang={lang}-XX"` should use base language

## Language Fallback

The system automatically falls back in this order:
1. Exact match (e.g., `es-AR`)
2. Base language (e.g., `es` from `es-AR`)
3. English (`en`)

This means:
- `es-MX` will use `es` if `es-MX` doesn't exist
- `fr-CA` will use `en` if neither `fr-CA` nor `fr` exist

## Translation File Structure

```json
{
  "meta": { "title": "...", "description": "..." },
  "tagline": "...",
  "reload": { "hit": "...", "space": "...", "or_click": "..." },
  "footer": { "share": "...", "source": "...", ... },
  "slack": { "footer": "..." },
  "reasons": {
    "to_deploy": ["...", "..."],
    "to_not_deploy": ["...", "..."],
    "thursday_afternoon": ["...", "..."],
    "friday_afternoon": ["...", "..."],
    "friday_13th": ["...", "..."],
    "afternoon": ["...", "..."],
    "weekend": ["...", "..."],
    "day_before_christmas": ["...", "..."],
    "christmas": ["...", "..."],
    "new_year": ["...", "..."]
  }
}
```

## Important Notes

- Use ISO 639-1 codes for languages (2 letters)
- Use ISO 3166-1 alpha-2 codes for regions (2 letters, uppercase)
- Format: `{lang}` or `{lang}-{REGION}`
- Always restart the dev server after adding a new language
- Both client and server files must be updated
- The `reasons` arrays can have different lengths per language
