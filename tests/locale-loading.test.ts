import { loadLocale } from '../helpers/locale-loading'

describe('locale loading', () => {
  it.each([
    ['en', 'en', 'Should I Deploy Today?'],
    ['es-AR', 'es-AR', '¿Debería deployar hoy?'],
    ['es-MX', 'es', '¿Debería desplegar hoy?'],
    ['fr-CA', 'en', 'Should I Deploy Today?'],
    ['bg', 'bg', 'Да деплойна ли днес?'],
    ['pt', 'pt', 'Devo fazer deploy hoje?'],
    ['cs', 'cs', 'Mám dnes nasadit?'],
    ['sl', 'sl', 'Naj danes objavim kodo?'],
    ['el', 'el', 'Να κάνω deploy σήμερα;'],
  ])('loads %s with the correct regional fallback', async (requested, language, title) => {
    const locale = await loadLocale(requested)
    expect(locale.language).toBe(language)
    expect(locale.messages.meta.title).toBe(title)
  })
})
