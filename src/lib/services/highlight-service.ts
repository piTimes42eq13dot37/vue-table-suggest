import { normalizeNumberLike } from './value-service'

const escapeRegExp = (value: string): string =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const resolveEnglishLocale = (): string => {
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

export const highlightText = (value: unknown, terms: string[]): string => {
  const html = escapeHtml(value)
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
          .map((digit) => escapeRegExp(digit))
          .join('[^0-9]*')
      : escapeRegExp(escapeHtml(term))

    const regex = new RegExp(pattern, 'gi')
    return result.replace(regex, (match) => `<mark>${match}</mark>`)
  }, html)
}
