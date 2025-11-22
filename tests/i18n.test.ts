import { translate, getTranslatedReasons } from '../helpers/i18n-server'

describe('i18n Server Helper', () => {
  describe('translate', () => {
    it('should translate a simple key in English', () => {
      expect(translate('meta.title', 'en')).toBe('Should I Deploy Today?')
    })

    it('should translate a simple key in Spanish', () => {
      expect(translate('meta.title', 'es')).toBe('¿Debería desplegar hoy?')
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
      expect(reasonsEn).toContain("I don't see why not")
      expect(reasonsEs).toContain("No veo por qué no")
    })
  })
})
