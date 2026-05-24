import { CheckCircle2, Gift, X } from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import { EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { useAdminGifticonExchangesState } from 'src/features/admin/useAdminData'
import type { GifticonExchangeStatus } from 'src/globals/api/types'

const FILTERS: {
    label: string
    value: GifticonExchangeStatus | 'ALL'
}[] = [
    { label: '전체', value: 'ALL' },
    { label: '발송 대기', value: 'PENDING' },
    { label: '발송 완료', value: 'SENT' },
    { label: '반려', value: 'REJECTED' },
]

const STATUS_LABEL: Record<GifticonExchangeStatus, string> = {
    PENDING: '발송 대기',
    SENT: '발송 완료',
    REJECTED: '반려',
}

function statusVariant(
    status: GifticonExchangeStatus,
): 'green' | 'gray' | 'yellow' {
    if (status === 'SENT') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'gray'
}

export const AdminPoints = () => {
    const { filter, setFilter, exchanges, stats, handleStatusUpdate } =
        useAdminGifticonExchangesState()

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title="기프티콘 관리" />
                <main className="mx-auto w-full max-w-7xl p-8">
                    <div className="mb-8">
                        <h2 className="mb-1 text-3xl font-bold">
                            기프티콘 관리
                        </h2>
                        <p className="text-on-surface-variant text-sm">
                            사용자별 기프티콘 교환 신청을 확인하고 발송
                            처리합니다.
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[
                            {
                                label: '발송 대기',
                                value: stats
                                    ? `${stats.pendingCount}건`
                                    : '—',
                            },
                            {
                                label: '대기 포인트',
                                value: stats
                                    ? `${stats.pendingPoints.toLocaleString()}P`
                                    : '—',
                            },
                            {
                                label: '발송 완료',
                                value: stats ? `${stats.sentCount}건` : '—',
                            },
                            {
                                label: '반려',
                                value: stats
                                    ? `${stats.rejectedCount}건`
                                    : '—',
                            },
                        ].map((stat) => (
                            <EcoCard
                                key={stat.label}
                                className="flex flex-col gap-2 p-5"
                            >
                                <span className="text-on-surface-variant text-xs font-bold">
                                    {stat.label}
                                </span>
                                <span className="text-primary text-2xl font-black">
                                    {stat.value}
                                </span>
                            </EcoCard>
                        ))}
                    </div>

                    <nav className="mb-4 flex flex-wrap gap-2">
                        {FILTERS.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setFilter(item.value)}
                                className={cn(
                                    'rounded-full px-4 py-2 text-xs font-bold transition-all',
                                    filter === item.value
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface-container-low text-on-surface-variant',
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="border-outline-variant bg-surface-container-low flex items-center gap-2 border-b p-4">
                            <Gift className="text-primary h-5 w-5" />
                            <h3 className="font-bold">기프티콘 교환 신청</h3>
                        </div>
                        {exchanges.length === 0 ? (
                            <p className="text-on-surface-variant p-8 text-center text-sm">
                                해당 상태의 교환 신청이 없습니다.
                            </p>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-outline-variant bg-surface text-on-surface-variant border-b text-xs font-bold">
                                        <th className="p-4">신청 일시</th>
                                        <th className="p-4">회원</th>
                                        <th className="p-4">기프티콘</th>
                                        <th className="p-4">포인트</th>
                                        <th className="p-4">상태</th>
                                        <th className="p-4 text-right">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-outline-variant/30 divide-y font-medium">
                                    {exchanges.map((item) => (
                                        <tr
                                            key={item.exchangeId}
                                            className="hover:bg-surface-container-low/30 transition-colors"
                                        >
                                            <td className="text-on-surface-variant p-4 text-xs">
                                                {new Date(
                                                    item.createdAt,
                                                ).toLocaleString('ko-KR')}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold">
                                                    {item.memberName}
                                                </div>
                                                <div className="text-on-surface-variant text-xs">
                                                    {item.memberPhone}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {item.rewardName}
                                            </td>
                                            <td className="text-error p-4 font-bold">
                                                -{item.pointUsed.toLocaleString()}
                                                P
                                            </td>
                                            <td className="p-4">
                                                <EcoBadge
                                                    variant={statusVariant(
                                                        item.status,
                                                    )}
                                                >
                                                    {STATUS_LABEL[item.status]}
                                                </EcoBadge>
                                            </td>
                                            <td className="p-4 text-right">
                                                {item.status === 'PENDING' ? (
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            className="bg-primary-container text-on-primary-container rounded-lg p-1.5 transition-all hover:brightness-95"
                                                            title="발송 완료"
                                                            onClick={() =>
                                                                void handleStatusUpdate(
                                                                    item.exchangeId,
                                                                    'SENT',
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-lg border p-1.5 transition-all"
                                                            title="반려"
                                                            onClick={() =>
                                                                void handleStatusUpdate(
                                                                    item.exchangeId,
                                                                    'REJECTED',
                                                                )
                                                            }
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-on-surface-variant text-xs">
                                                        {item.processedAt
                                                            ? new Date(
                                                                  item.processedAt,
                                                              ).toLocaleString(
                                                                  'ko-KR',
                                                              )
                                                            : '-'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </EcoCard>
                </main>
            </div>
        </>
    )
}
