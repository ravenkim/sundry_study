import { useTranslation } from 'react-i18next'
import { CheckCircle2, Gift, X } from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import { EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { useAdminGifticonExchangesState } from 'src/features/admin/useAdminData'
import {
    formatDateTime,
    formatNumber,
    useAppLocale,
} from 'src/shared/lib/i18n/formatters'
import type { GifticonExchangeStatus } from 'src/globals/api/types'

function statusVariant(
    status: GifticonExchangeStatus,
): 'green' | 'gray' | 'yellow' {
    if (status === 'SENT') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'gray'
}

export const AdminPoints = () => {
    const { t } = useTranslation('admin')
    const locale = useAppLocale()
    const { filter, setFilter, exchanges, stats, handleStatusUpdate } =
        useAdminGifticonExchangesState()

    const filters: {
        label: string
        value: GifticonExchangeStatus | 'ALL'
    }[] = [
        { label: t('gifticon.filter.all'), value: 'ALL' },
        { label: t('gifticon.filter.pending'), value: 'PENDING' },
        { label: t('gifticon.filter.sent'), value: 'SENT' },
        { label: t('gifticon.filter.rejected'), value: 'REJECTED' },
    ]

    const statCards = [
        {
            label: t('gifticon.stats.pendingCount'),
            value: stats
                ? t('gifticon.stats.pendingCountValue', {
                      count: stats.pendingCount,
                  })
                : '—',
        },
        {
            label: t('gifticon.stats.pendingPoints'),
            value: stats
                ? t('gifticon.stats.pendingPointsValue', {
                      points: formatNumber(stats.pendingPoints, locale),
                  })
                : '—',
        },
        {
            label: t('gifticon.stats.sentCount'),
            value: stats
                ? t('gifticon.stats.sentCountValue', { count: stats.sentCount })
                : '—',
        },
        {
            label: t('gifticon.stats.rejectedCount'),
            value: stats
                ? t('gifticon.stats.rejectedCountValue', {
                      count: stats.rejectedCount,
                  })
                : '—',
        },
    ]

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title={t('gifticon.headerTitle')} />
                <main className="mx-auto w-full max-w-7xl p-8">
                    <div className="mb-8">
                        <h2 className="mb-1 text-3xl font-bold">
                            {t('gifticon.title')}
                        </h2>
                        <p className="text-on-surface-variant text-sm">
                            {t('gifticon.description')}
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {statCards.map((stat) => (
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
                        {filters.map((item) => (
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
                            <h3 className="font-bold">
                                {t('gifticon.sectionTitle')}
                            </h3>
                        </div>
                        {exchanges.length === 0 ? (
                            <p className="text-on-surface-variant p-8 text-center text-sm">
                                {t('gifticon.empty')}
                            </p>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-outline-variant bg-surface text-on-surface-variant border-b text-xs font-bold">
                                        <th className="p-4">
                                            {t('gifticon.table.requestDate')}
                                        </th>
                                        <th className="p-4">
                                            {t('gifticon.table.member')}
                                        </th>
                                        <th className="p-4">
                                            {t('gifticon.table.reward')}
                                        </th>
                                        <th className="p-4">
                                            {t('gifticon.table.points')}
                                        </th>
                                        <th className="p-4">
                                            {t('gifticon.table.status')}
                                        </th>
                                        <th className="p-4 text-right">
                                            {t('gifticon.table.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-outline-variant/30 divide-y font-medium">
                                    {exchanges.map((item) => (
                                        <tr
                                            key={item.exchangeId}
                                            className="hover:bg-surface-container-low/30 transition-colors"
                                        >
                                            <td className="text-on-surface-variant p-4 text-xs">
                                                {formatDateTime(
                                                    item.createdAt,
                                                    locale,
                                                )}
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
                                                {t('gifticon.pointsUsed', {
                                                    points: formatNumber(
                                                        item.pointUsed,
                                                        locale,
                                                    ),
                                                })}
                                            </td>
                                            <td className="p-4">
                                                <EcoBadge
                                                    variant={statusVariant(
                                                        item.status,
                                                    )}
                                                >
                                                    {t(
                                                        `gifticon.status.${item.status}`,
                                                    )}
                                                </EcoBadge>
                                            </td>
                                            <td className="p-4 text-right">
                                                {item.status === 'PENDING' ? (
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            className="bg-primary-container text-on-primary-container rounded-lg p-1.5 transition-all hover:brightness-95"
                                                            title={t(
                                                                'gifticon.actions.markSent',
                                                            )}
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
                                                            title={t(
                                                                'gifticon.actions.reject',
                                                            )}
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
                                                            ? formatDateTime(
                                                                  item.processedAt,
                                                                  locale,
                                                              )
                                                            : t(
                                                                  'gifticon.noProcessedDate',
                                                              )}
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
