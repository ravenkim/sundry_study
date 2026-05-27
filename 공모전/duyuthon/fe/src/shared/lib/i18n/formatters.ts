import { useTranslation } from 'react-i18next'

export type AppLocale = 'ko-KR' | 'en-US'

export function resolveAppLocale(language: string): AppLocale {
    return language.startsWith('ko') ? 'ko-KR' : 'en-US'
}

export function useAppLocale(): AppLocale {
    const { i18n } = useTranslation()
    return resolveAppLocale(i18n.language)
}

export function formatDate(
    value: Date | string | number,
    locale: AppLocale,
    options?: Intl.DateTimeFormatOptions,
): string {
    const date = value instanceof Date ? value : new Date(value)
    return date.toLocaleDateString(locale, options)
}

export function formatDateTime(
    value: Date | string | number,
    locale: AppLocale,
    options?: Intl.DateTimeFormatOptions,
): string {
    const date = value instanceof Date ? value : new Date(value)
    return date.toLocaleString(locale, options)
}

export function formatNumber(
    value: number,
    locale: AppLocale,
    options?: Intl.NumberFormatOptions,
): string {
    return value.toLocaleString(locale, options)
}
