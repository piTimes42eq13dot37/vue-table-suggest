import { normalizeNumberLike } from './value-service'

class HighlightService {
  private escapeRegExp(value: string): string {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  private escapeHtml(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  resolveEnglishLocale(): string {
    if (
      typeof globalThis === 'undefined' ||
      typeof globalThis.navigator === 'undefined' ||
      !Array.isArray(globalThis.navigator.languages)
    ) {
      return 'en-US'
    }

    return (
      globalThis.navigator.languages.find((lang) => String(lang).toLowerCase().startsWith('en')) ??
      'en-US'
    )
  }

  highlightText(value: unknown, terms: string[]): string {
    const html = this.escapeHtml(value)
    const cleanTerms = terms
      .map((term) => String(term || '').trim())
      .filter((term) => term.length > 0)

    if (!cleanTerms.length) return html

    return cleanTerms.reduce((result, term) => {
      const numeric = normalizeNumberLike(term)
      const isDigitsOnly = numeric.length > 0 && numeric === String(term)

      const pattern = isDigitsOnly
        ? numeric
            .split('')
            .map((digit) => this.escapeRegExp(digit))
            .join('[^0-9]*')
        : this.escapeRegExp(this.escapeHtml(term))

      const regex = new RegExp(pattern, 'gi')
      return result.replace(regex, (match) => `<mark>${match}</mark>`)
    }, html)
  }
}

const highlightService = new HighlightService()

export const resolveEnglishLocale = (): string => highlightService.resolveEnglishLocale()

export const highlightText = (value: unknown, terms: string[]): string =>
  highlightService.highlightText(value, terms)
