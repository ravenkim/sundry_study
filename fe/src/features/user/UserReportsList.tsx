import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { MascotEmptyState } from 'src/shared/components/mascort'
import { SSloadingState, SSstaggerChildren } from 'src/shared/components/motion'
import { ReportMascotThumbnail } from './ReportMascotThumbnail'
import { EcoBadge, EcoButton } from 'src/shared/ui/eco'
import { getMyReports } from 'src/globals/api/reportApi'
import type { PaginatedReports, ReportStatus } from 'src/globals/api/types'
import { useReportStatusLabel } from 'src/shared/lib/i18n/reportStatus'
import { useAppLocale, formatDate } from 'src/shared/lib/i18n/formatters'

const FILTER_VALUES: { value: ReportStatus | 'ALL'; labelKey: string }[] = [
    { value: 'ALL', labelKey: 'list.filterAll' },
    { value: 'APPROVED', labelKey: 'list.filterApproved' },
    { value: 'PENDING', labelKey: 'list.filterPending' },
    { value: 'REJECTED', labelKey: 'list.filterRejected' },
    { value: 'UNDETECTABLE', labelKey: 'list.filterUndetectable' },
]

function statusVariant(status: ReportStatus): 'green' | 'gray' | 'yellow' {
    if (status === 'APPROVED') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'gray'
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
    const label = useReportStatusLabel(status)
    return (
        <EcoBadge variant={statusVariant(status)}>{label}</EcoBadge>
    )
}

export const UserReportsList = () => {
    const { t } = useTranslation('report')
    const locale = useAppLocale()
    const [filter, setFilter] = useState<ReportStatus | 'ALL'>('ALL')
    const [page, setPage] = useState(0)
    const [data, setData] = useState<PaginatedReports | null>(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const hasLoadedRef = useRef(false)

    const filters = useMemo(
        () =>
            FILTER_VALUES.map((f) => ({
                ...f,
                label: t(f.labelKey),
            })),
        [t],
    )

    const activeFilterLabel = filters.find((f) => f.value === filter)?.label

    useEffect(() => {
        let cancelled = false
        const isInitial = !hasLoadedRef.current
        if (isInitial) {
            setInitialLoading(true)
        } else {
            setRefreshing(true)
        }

        void getMyReports(page, 10, filter)
            .then((next) => {
                if (!cancelled) {
                    setData(next)
                    hasLoadedRef.current = true
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setInitialLoading(false)
                    setRefreshing(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [filter, page])

    return (
        <div className="flex flex-col gap-6 p-5 pb-8">
            <nav className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        type="button"
                        onClick={() => {
                            setFilter(f.value)
                            setPage(0)
                        }}
                        className={cn(
                            'rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all',
                            filter === f.value
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-low text-on-surface-variant',
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </nav>

            {initialLoading ? (
                <SSloadingState text={t('list.loading')} />
            ) : !data || data.content.length === 0 ? (
                <MascotEmptyState
                    emotion="question"
                    title={
                        filter === 'ALL'
                            ? t('list.emptyAllTitle')
                            : t('list.emptyFilteredTitle', {
                                  filter: activeFilterLabel ?? '',
                              })
                    }
                    description={
                        filter === 'ALL'
                            ? t('list.emptyAllDescription')
                            : t('list.emptyFilteredDescription')
                    }
                />
            ) : (
                <div className="relative flex flex-col gap-3">
                    {refreshing ? (
                        <div className="absolute inset-x-0 -top-1 flex justify-center">
                            <Loader2 className="text-primary h-4 w-4 animate-spin" />
                        </div>
                    ) : null}
                    <SSstaggerChildren className="flex flex-col gap-3">
                    {data.content.map((item) => (
                        <div
                            key={item.reportId}
                            className="border-outline-variant bg-surface-container-lowest flex gap-4 rounded-xl border p-4"
                        >
                            <ReportMascotThumbnail
                                status={item.status}
                                pointAwarded={item.pointAwarded}
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                <span className="truncate font-bold">
                                    {item.roomName}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {item.detectionLabel && (
                                        <EcoBadge>
                                            {item.detectionLabel}
                                        </EcoBadge>
                                    )}
                                    <ReportStatusBadge status={item.status} />
                                </div>
                                <span className="text-on-surface-variant text-xs">
                                    {formatDate(item.createdAt, locale)}
                                </span>
                            </div>
                            <span
                                className={cn(
                                    'shrink-0 self-center font-bold',
                                    item.pointAwarded > 0
                                        ? 'text-secondary'
                                        : 'text-on-surface-variant',
                                )}
                            >
                                {item.pointAwarded > 0
                                    ? `+${item.pointAwarded}P`
                                    : t('list.noPoints')}
                            </span>
                        </div>
                    ))}
                    </SSstaggerChildren>
                </div>
            )}

            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <EcoButton
                        variant="outline"
                        className="px-3 py-2"
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </EcoButton>
                    <span className="text-sm font-bold">
                        {t('list.pagination', {
                            current: page + 1,
                            total: data.totalPages,
                        })}
                    </span>
                    <EcoButton
                        variant="outline"
                        className="px-3 py-2"
                        disabled={page >= data.totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </EcoButton>
                </div>
            )}
        </div>
    )
}
