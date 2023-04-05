import langs from '../languages';

export default class Language {
  static DEFAULT_LANGUAGE = 'en';

  /**
   * Check if language exists
   * @param language selected language
   * @returns true if exists, else false
   */
  static exists(language: string) {
    return langs.some(x => x.key === language);
  }
}