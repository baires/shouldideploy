import { translate, getTranslatedReasons } from '../helpers/i18n-server'

describe('i18n Server Helper', () => {
  describe('translate', () => {
    it('should translate a simple key in English', () => {
      expect(translate('meta.title', 'en')).toBe('Should I Deploy Today?')
    })

    it('should default to English if language is not provided', () => {
      expect(translate('meta.title')).toBe('Should I Deploy Today?')
    })

    it('should translate a simple key in Spanish', () => {
      expect(translate('meta.title', 'es')).toBe('¿Debería desplegar hoy?')
    })

    it('should translate a simple key in Czech', () => {
      expect(translate('meta.title', 'cs')).toBe('Mám dnes nasadit?')
    })

    it('should translate a simple key in Slovenian', () => {
      expect(translate('meta.title', 'sl')).toBe('Naj danes objavim kodo?')
    })

    it('should translate a simple key in Greek', () => {
      expect(translate('meta.title', 'el')).toBe('Να κάνω deploy σήμερα;')
    })

    it('should translate a simple key in Bulgarian', () => {
      expect(translate('meta.title', 'bg')).toBe('Да деплойна ли днес?')
    })

    it('should use specific regional translation (es-AR) when available', () => {
      expect(translate('meta.title', 'es-AR')).toBe('¿Debería deployar hoy?')
    })

    it('should fall back to base language (es) if regional locale (es-XY) is missing', () => {
      // 'es-XY' doesn't exist, so getLocaleData tries 'es'
      expect(translate('meta.title', 'es-XY')).toBe('¿Debería desplegar hoy?')
    })

    it('should fall back to English if key missing in target language', () => {
      // 'fr' is not in the locales list, so it should fallback to 'en'
      expect(translate('meta.title', 'fr')).toBe('Should I Deploy Today?')
    })

    it('should return the key if not found in any language', () => {
      const key = 'non.existent.key'
      expect(translate(key, 'en')).toBe(key)
    })

    it('should handle nested keys', () => {
      const result = translate('reasons', 'en')
      expect(result).toHaveProperty('to_deploy')
    })
  })

  describe('getTranslatedReasons', () => {
    it('should return an array of strings', () => {
      const reasons = getTranslatedReasons('to_deploy', 'en')
      expect(Array.isArray(reasons)).toBe(true)
      expect(reasons.length).toBeGreaterThan(0)
      expect(typeof reasons[0]).toBe('string')
    })

    it('should return translated reasons', () => {
      const reasonsEn = getTranslatedReasons('to_deploy', 'en')
      const reasonsEs = getTranslatedReasons('to_deploy', 'es')
      const reasonsSl = getTranslatedReasons('to_deploy', 'sl')
      const reasonsEl = getTranslatedReasons('to_deploy', 'el')
      const reasonsBg = getTranslatedReasons('to_deploy', 'bg')
      expect(reasonsEn).toContain("I don't see why not")
      expect(reasonsEs).toContain("No veo por qué no")
      expect(reasonsSl).toContain("Ne vidim razloga, zakaj ne")
      expect(reasonsEl).toContain("Γιατί όχι;")
      expect(reasonsBg).toContain("Не виждам защо не")
    })
  })
})
