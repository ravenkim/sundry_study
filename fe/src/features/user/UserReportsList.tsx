import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoBadge, EcoButton } from 'src/shared/ui/eco'
import { getMyReports } from 'src/globals/api/reportApi'
import type { PaginatedReports, ReportStatus } from 'src/globals/api/types'

const FILTERS: { label: string; value: ReportStatus | 'ALL' }[] = [
    { label: '전체', value: 'ALL' },
    { label: '승인됨', value: 'APPROVED' },
    { label: '처리중', value: 'PENDING' },
    { label: '반려', value: 'REJECTED' },
    { label: '판별불가', value: 'UNDETECTABLE' },
]

const STATUS_LABEL: Record<ReportStatus, string> = {
    APPROVED: '승인됨',
    PENDING: '처리중',
    REJECTED: '반려',
    UNDETECTABLE: '판별불가',
}

function statusVariant(status: ReportStatus): 'green' | 'gray' | 'yellow' {
    if (status === 'APPROVED') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'gray'
}

export const UserReportsList = () => {
    const [filter, setFilter] = useState<ReportStatus | 'ALL'>('ALL')
    const [page, setPage] = useState(0)
    const [data, setData] = useState<PaginatedReports | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        void getMyReports(page, 10, filter)
            .then(setData)
            .finally(() => setLoading(false))
    }, [filter, page])

    return (
        <div className="flex flex-col gap-6 p-5 pb-8">
            <nav className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
                {FILTERS.map((f) => (
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

            {loading ? (
                <p className="text-on-surface-variant py-12 text-center text-sm">
                    불러오는 중...
                </p>
            ) : !data || data.content.length === 0 ? (
                <p className="text-on-surface-variant py-12 text-center text-sm">
                    제보 내역이 없습니다.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.content.map((item) => (
                        <div
                            key={item.reportId}
                            className="border-outline-variant bg-surface-container-lowest flex gap-4 rounded-xl border p-4"
                        >
                            {item.thumbnailUrl ? (
                                <img
                                    src={item.thumbnailUrl}
                                    alt=""
                                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="bg-surface-container flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-2xl">
                                    📷
                                </div>
                            )}
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
                                    <EcoBadge
                                        variant={statusVariant(item.status)}
                                    >
                                        {STATUS_LABEL[item.status]}
                                    </EcoBadge>
                                </div>
                                <span className="text-on-surface-variant text-xs">
                                    {new Date(
                                        item.createdAt,
                                    ).toLocaleDateString('ko-KR')}
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
                                    : '-'}
                            </span>
                        </div>
                    ))}
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
                        {page + 1} / {data.totalPages}
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
