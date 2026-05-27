import { useTranslation } from 'react-i18next'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

type LanguageSwitcherProps = {
    className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const { i18n } = useTranslation()
    const current = i18n.language.startsWith('ko') ? 'ko' : 'en'

    const setLanguage = (lng: 'ko' | 'en') => {
        if (current !== lng) {
            void i18n.changeLanguage(lng)
        }
    }

    return (
        <div
            className={cn(
                'bg-surface-container-high flex rounded-lg p-0.5',
                className,
            )}
            role="group"
            aria-label={i18n.t('common:language.label')}
        >
            <button
                type="button"
                onClick={() => setLanguage('ko')}
                className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    current === 'ko'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:text-on-surface',
                )}
            >
                KO
            </button>
            <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    current === 'en'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:text-on-surface',
                )}
            >
                EN
            </button>
        </div>
    )
}
