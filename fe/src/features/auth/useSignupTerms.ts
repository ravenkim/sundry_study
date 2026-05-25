import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export interface TermSection {
    title: string
    content: string
}

export interface SignupTerm {
    id: string
    label: string
    required: boolean
    summary: string
    sections: TermSection[]
    viewer: 'drawer' | 'sheet' | 'accordion'
}

const TERM_IDS = ['service', 'privacy', 'marketing'] as const

const TERM_CONFIG: Record<
    (typeof TERM_IDS)[number],
    { required: boolean; viewer: SignupTerm['viewer'] }
> = {
    service: { required: true, viewer: 'drawer' },
    privacy: { required: true, viewer: 'sheet' },
    marketing: { required: false, viewer: 'accordion' },
}

export function useSignupTerms(): SignupTerm[] {
    const { t } = useTranslation('legal')

    return useMemo(
        () =>
            TERM_IDS.map((id) => {
                const config = TERM_CONFIG[id]
                const sectionsRaw = t(`${id}.sections`, {
                    returnObjects: true,
                }) as TermSection[] | string

                const sections = Array.isArray(sectionsRaw) ? sectionsRaw : []

                return {
                    id,
                    label: t(`${id}.label`),
                    summary: t(`${id}.summary`),
                    required: config.required,
                    viewer: config.viewer,
                    sections,
                }
            }),
        [t],
    )
}
