/** @jest-environment jsdom */
import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { useRouter, NextRouter } from 'next/router'
import Page from '../pages/index'
import { LanguageProvider } from '../helpers/i18n'
import en from '../locales/en.json'

jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('next/head', () => ({ __esModule: true, default: () => null }))

let container: HTMLDivElement
let root: Root
let router: NextRouter
let browserTimezone: string | Error

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  jest.useFakeTimers().setSystemTime(new Date('2026-11-06T00:30:00Z'))
  browserTimezone = 'America/Chicago'
  const DateTimeFormat = Intl.DateTimeFormat
  jest.spyOn(Intl, 'DateTimeFormat').mockImplementation((...args) => {
    const formatter = new DateTimeFormat(...args)
    if (args.length === 0) {
      const options = formatter.resolvedOptions()
      formatter.resolvedOptions = () => {
        if (browserTimezone instanceof Error) throw browserTimezone
        return { ...options, timeZone: browserTimezone }
      }
    }
    return formatter
  })
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({ matches: false }),
  })
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  router = { query: {}, isReady: false, push: jest.fn() } as unknown as NextRouter
  jest.mocked(useRouter).mockImplementation(() => router)
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  jest.restoreAllMocks()
  jest.useRealTimers()
})

async function renderPage() {
  await act(async () => root.render(
    <LanguageProvider>
      <Page tz="UTC" now={{ timezone: 'UTC', customDate: '' }} reasonSeed={0} />
    </LanguageProvider>
  ))
}

const timezone = () => container.querySelector('select')!.value
const message = () => container.querySelector('#text')!.textContent

test('applies the URL timezone when the router becomes ready', async () => {
  await renderPage()
  expect(timezone()).toBe('UTC')
  expect(message()).toBe(en.reasons.to_not_deploy[0])

  router = { ...router, query: { tz: 'US/Central' }, isReady: true }
  await renderPage()
  expect(timezone()).toBe('US/Central')
  expect(message()).toBe(en.reasons.thursday_afternoon[0])
})

test.each([
  [{}, 'America/Chicago'],
  [{ tz: 'Invalid/Timezone' }, 'America/Chicago'],
  [{ tz: '' }, 'America/Chicago'],
  [{ tz: ['UTC', 'US/Central'] }, 'America/Chicago'],
  [{ tz: 'UTC' }, 'UTC'],
])('resolves query %j to %s', async (query, expected) => {
  router = { ...router, query, isReady: true }
  await renderPage()
  expect(timezone()).toBe(expected)
})

test('falls back to UTC if browser timezone detection fails', async () => {
  browserTimezone = new Error('Timezone unavailable')
  router = { ...router, isReady: true }
  await renderPage()
  expect(timezone()).toBe('UTC')
})

test('falls back to UTC if the browser returns an invalid timezone', async () => {
  browserTimezone = 'Invalid/Timezone'
  router = { ...router, isReady: true }
  await renderPage()
  expect(timezone()).toBe('UTC')
})

test('follows timezone changes and removal during navigation', async () => {
  router = { ...router, query: { tz: 'UTC' }, isReady: true }
  await renderPage()
  router = { ...router, query: { tz: 'US/Central' } }
  await renderPage()
  expect(timezone()).toBe('US/Central')
  expect(message()).toBe(en.reasons.thursday_afternoon[0])
  router = { ...router, query: {} }
  await renderPage()
  expect(timezone()).toBe('America/Chicago')
})

test('preserves a custom date when changing the timezone', async () => {
  window.history.replaceState(null, '', '/?tz=UTC&date=2026-12-25')
  router = { ...router, query: { tz: 'UTC', date: '2026-12-25' }, isReady: true }
  await renderPage()
  expect(message()).toBe(en.reasons.christmas[0])

  await act(async () => {
    const select = container.querySelector('select')!
    select.value = 'US/Central'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  expect(router.push).toHaveBeenCalledWith('/?tz=US%2FCentral&date=2026-12-25')
  expect(message()).toBe(en.reasons.christmas[0])

  router = { ...router, query: { ...router.query, tz: 'US/Central' } }
  await renderPage()
  expect(timezone()).toBe('US/Central')
  expect(message()).toBe(en.reasons.christmas[0])
})
