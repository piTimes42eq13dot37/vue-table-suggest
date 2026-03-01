import { describe, expect, it } from 'vitest'
import { highlightText, resolveEnglishLocale } from './highlight-service'

describe('highlight-service', () => {
  it('returns escaped html when no terms are provided', () => {
    const result = highlightText('<b>alpha</b>', [])
    expect(result).toBe('&lt;b&gt;alpha&lt;/b&gt;')
  })

  it('highlights plain text terms case-insensitively', () => {
    const result = highlightText('Classic Pension Alpha', ['alpha'])
    expect(result).toContain('<mark>Alpha</mark>')
  })

  it('highlights grouped numeric matches for digit-only terms', () => {
    const result = highlightText('10.000.021.304', ['10000021304'])
    expect(result).toContain('<mark>10.000.021.304</mark>')
  })

  it('resolves locale to english fallback when no english language is present', () => {
    const originalNavigator = globalThis.navigator

    Object.defineProperty(globalThis, 'navigator', {
      value: { languages: ['de-DE', 'fr-FR'] },
      configurable: true,
    })

    try {
      expect(resolveEnglishLocale()).toBe('en-US')
    } finally {
      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        configurable: true,
      })
    }
  })
})
