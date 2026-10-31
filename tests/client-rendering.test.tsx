/** @jest-environment jsdom */
import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { LanguageProvider, useTranslation } from '../helpers/i18n'
import * as locales from '../helpers/locale-loading'
import Widget from '../component/widget'
import Time from '../helpers/time'
import en from '../locales/en.json'
import cs from '../locales/cs.json'

let container: HTMLDivElement
let root: Root
let translation: ReturnType<typeof useTranslation>

function TranslationProbe() {
  translation = useTranslation()
  return <h1>{translation.t('meta.title')}</h1>
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  jest.restoreAllMocks()
})

async function renderTranslation() {
  await act(async () => root.render(
    <LanguageProvider><TranslationProbe /></LanguageProvider>
  ))
}

test('detects the browser language and uses regional fallback', async () => {
  jest.spyOn(navigator, 'language', 'get').mockReturnValue('es-MX')
  await renderTranslation()
  expect(container.textContent).toBe('¿Debería desplegar hoy?')
  expect(translation.language).toBe('es')
})

test('restores a saved language before the browser preference', async () => {
  localStorage.setItem('language', 'es-AR')
  await renderTranslation()
  expect(container.textContent).toBe('¿Debería deployar hoy?')
  expect(translation.t('missing.key')).toBe('missing.key')
})

test('switches language and saves the loaded choice', async () => {
  await renderTranslation()
  await act(async () => translation.setLanguage('pt'))
  expect(container.textContent).toBe('Devo fazer deploy hoje?')
  expect(localStorage.getItem('language')).toBe('pt')
})

test('a slow earlier translation cannot replace the latest selection', async () => {
  await renderTranslation()
  let finish!: (value: typeof locales.englishLocale) => void
  const pending = new Promise<typeof locales.englishLocale>(resolve => { finish = resolve })
  jest.spyOn(locales, 'loadLocale').mockReturnValueOnce(pending)
  await act(async () => { translation.setLanguage('cs') })
  await act(async () => translation.setLanguage('pt'))
  await act(async () => { finish({ language: 'cs', messages: cs }) })
  expect(container.textContent).toBe('Devo fazer deploy hoje?')
  expect(localStorage.getItem('language')).toBe('pt')
})

test('a failed translation download keeps the current content and preference', async () => {
  await renderTranslation()
  const initial = container.textContent
  const preference = localStorage.getItem('language')
  jest.spyOn(locales, 'loadLocale').mockRejectedValueOnce(new Error('Offline'))
  await act(async () => translation.setLanguage('el'))
  expect(container.textContent).toBe(initial)
  expect(localStorage.getItem('language')).toBe(preference)
})

test('click and Space refresh the message; other keys do not', async () => {
  await act(async () => root.render(
    <LanguageProvider><Widget now={new Time('UTC', '2026-11-02')} reasonSeed={0} /></LanguageProvider>
  ))
  const reason = () => container.querySelector('#text')?.textContent
  expect(reason()).toBe(en.reasons.to_deploy[0])
  jest.spyOn(Math, 'random').mockReturnValue(0.5)
  await act(async () => { container.querySelector('#reload')!.dispatchEvent(new MouseEvent('click', { bubbles: true })) })
  expect(reason()).toBe(en.reasons.to_deploy[Math.floor(0.5 * en.reasons.to_deploy.length)])
  const before = reason()
  await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })) })
  expect(reason()).toBe(before)
  jest.spyOn(Math, 'random').mockReturnValue(0.9)
  const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
  await act(async () => { document.dispatchEvent(space) })
  expect(space.defaultPrevented).toBe(true)
  expect(reason()).toBe(en.reasons.to_deploy[Math.floor(0.9 * en.reasons.to_deploy.length)])
})
