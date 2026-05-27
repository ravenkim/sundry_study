import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'

export type SearchableSelectOption = {
    value: number
    label: string
}

type Props = {
    options: SearchableSelectOption[]
    value: number | ''
    onChange: (value: number | '') => void
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
    className?: string
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    disabled = false,
    className,
}: Props) {
    const { t } = useTranslation('common')
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const resolvedPlaceholder = placeholder ?? t('select.placeholder')
    const resolvedSearchPlaceholder =
        searchPlaceholder ?? t('select.searchPlaceholder')

    const selected = options.find((option) => option.value === value)

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return options
        return options.filter((option) =>
            option.label.toLowerCase().includes(normalized),
        )
    }, [options, query])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'border-outline-variant bg-surface focus:ring-primary-container flex w-full items-center justify-between rounded-lg border p-3.5 text-left outline-none focus:ring-2',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
            >
                <span
                    className={cn(
                        selected ? 'text-on-surface' : 'text-on-surface-variant',
                    )}
                >
                    {selected?.label ?? resolvedPlaceholder}
                </span>
                <ChevronDown
                    className={cn(
                        'text-on-surface-variant h-4 w-4 transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </button>

            {open && (
                <div className="border-outline-variant bg-surface absolute z-20 mt-1 w-full overflow-hidden rounded-lg border shadow-lg">
                    <div className="border-outline-variant flex items-center gap-2 border-b px-3 py-2">
                        <Search className="text-on-surface-variant h-4 w-4 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={resolvedSearchPlaceholder}
                            className="text-on-surface placeholder:text-on-surface-variant w-full bg-transparent text-sm outline-none"
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <li className="text-on-surface-variant px-3 py-2 text-sm">
                                {t('select.noResults')}
                            </li>
                        ) : (
                            filtered.map((option) => (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        className={cn(
                                            'hover:bg-surface-container-low w-full px-3 py-2.5 text-left text-sm',
                                            value === option.value &&
                                                'bg-primary-container/20 text-primary font-semibold',
                                        )}
                                        onClick={() => {
                                            onChange(option.value)
                                            setOpen(false)
                                            setQuery('')
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}
