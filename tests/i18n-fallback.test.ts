import { translate } from '../helpers/i18n-server'

// Mock the locale files to control the data for fallback tests
jest.mock('../locales/en.json', () => ({
  fallback_key: 'Fallback Value',
  nested: {
    fallback_key: 'Nested Fallback Value'
  }
}))

jest.mock('../locales/es.json', () => ({
  // es has 'nested' but not 'nested.fallback_key'
  nested: {}
}))

jest.mock('../locales/es-AR.json', () => ({}))
jest.mock('../locales/pt.json', () => ({}))

describe('i18n Server Helper - Fallback Coverage', () => {
  test('should return English value when key is missing in target language', () => {
    // 'es' does not have 'fallback_key', 'en' does.
    // This should trigger lines 52-66 in i18n-server.ts
    expect(translate('fallback_key', 'es')).toBe('Fallback Value')
  })

  test('should return English value when nested key is missing in target language', () => {
    // 'es' has 'nested' object, but missing 'fallback_key' inside it.
    expect(translate('nested.fallback_key', 'es')).toBe('Nested Fallback Value')
  })
})
