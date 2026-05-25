import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoBadge, EcoCard, EcoButton } from 'src/shared/ui/eco'
import { usePoints } from 'src/features/points/PointsContext'
import { RewardImage } from 'src/features/user/RewardImage'
import {
    REWARD_CATEGORY_API_VALUES,
    type RewardCategoryKey,
} from 'src/features/user/rewardAssets'
import {
    exchangeReward,
    getMyGifticonExchanges,
    getRewards,
} from 'src/globals/api/pointsApi'
import type {
    GifticonExchangeRow,
    GifticonExchangeStatus,
    RewardItem,
} from 'src/globals/api/types'
import { useAppLocale, formatDate, formatNumber } from 'src/shared/lib/i18n/formatters'
import { SSloadingState, SSstaggerChildren } from 'src/shared/components/motion'

type CategoryFilter = 'all' | RewardCategoryKey

const CATEGORY_FILTERS: CategoryFilter[] = [
    'all',
    'coffee',
    'convenience',
    'donation',
]

const EXCHANGE_STATUS_KEYS: Record<
    GifticonExchangeStatus,
    'pending' | 'sent' | 'rejected'
> = {
    PENDING: 'pending',
    SENT: 'sent',
    REJECTED: 'rejected',
}

function exchangeStatusVariant(
    status: GifticonExchangeStatus,
): 'green' | 'gray' | 'yellow' {
    if (status === 'SENT') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'gray'
}

export const UserPointShop = () => {
    const { t } = useTranslation(['user', 'common'])
    const locale = useAppLocale()
    const { points, refresh } = usePoints()
    const [rewards, setRewards] = useState<RewardItem[]>([])
    const [rewardsLoading, setRewardsLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
    const [selectedReward, setSelectedReward] = useState<RewardItem | null>(
        null,
    )
    const [exchanging, setExchanging] = useState(false)
    const [myExchanges, setMyExchanges] = useState<GifticonExchangeRow[]>([])

    const categoryTabs = useMemo(
        () =>
            CATEGORY_FILTERS.map((key) => ({
                key,
                label:
                    key === 'all'
                        ? t('user:shop.categoryAll')
                        : t(`user:rewardCategory.${key}`),
            })),
        [t],
    )

    const activeCategoryLabel =
        categoryTabs.find((tab) => tab.key === activeCategory)?.label ?? ''

    const loadMyExchanges = () => {
        void getMyGifticonExchanges()
            .then(setMyExchanges)
            .catch(() => setMyExchanges([]))
    }

    const loadRewards = () => {
        setRewardsLoading(true)
        void getRewards()
            .then(setRewards)
            .catch(() => {
                toast.error(t('user:shop.errorLoadRewards'))
                setRewards([])
            })
            .finally(() => setRewardsLoading(false))
    }

    useEffect(() => {
        loadRewards()
        loadMyExchanges()
    }, [])

    const filtered =
        activeCategory === 'all'
            ? rewards
            : rewards.filter(
                  (r) =>
                      r.category ===
                      REWARD_CATEGORY_API_VALUES[activeCategory],
              )

    const handleExchange = async () => {
        if (!selectedReward) return
        if (points.currentBalance < selectedReward.pointCost) {
            toast.error(t('user:shop.errorInsufficientPoints'))
            return
        }

        setExchanging(true)
        try {
            await exchangeReward(selectedReward.rewardId)
            await refresh()
            loadMyExchanges()
            toast.success(t('user:shop.successExchange'))
            setSelectedReward(null)
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : t('user:shop.errorExchangeFailed'),
            )
        } finally {
            setExchanging(false)
        }
    }

    return (
        <div className="relative flex flex-col gap-6 p-5 pb-8">
            <EcoCard className="border-primary-container bg-primary-container/10 p-5">
                <span className="text-on-surface-variant text-xs font-bold tracking-wider uppercase">
                    {t('user:shop.myPoints')}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-primary text-5xl leading-none font-black">
                        {formatNumber(points.currentBalance, locale)}
                    </span>
                    <span className="text-primary text-2xl font-bold">P</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <TrendingUp className="text-secondary h-3.5 w-3.5" />
                    <span className="text-secondary text-xs font-bold">
                        {t('user:shop.thisMonthEarned', {
                            points: points.thisMonthEarned,
                        })}
                    </span>
                </div>
                <div className="text-on-surface-variant mt-3 flex gap-4 text-xs">
                    <span>
                        {t('user:shop.totalEarned', {
                            points: formatNumber(points.totalEarned, locale),
                        })}
                    </span>
                    <span>
                        {t('user:shop.totalRedeemed', {
                            points: formatNumber(points.totalRedeemed, locale),
                        })}
                    </span>
                </div>
            </EcoCard>

            {myExchanges.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold">
                        {t('user:shop.myExchangesTitle')}
                    </h2>
                    <div className="flex flex-col gap-2">
                        {myExchanges.map((item) => (
                            <EcoCard
                                key={item.exchangeId}
                                className="flex items-center justify-between gap-3 p-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold">
                                        {item.rewardName}
                                    </p>
                                    <p className="text-on-surface-variant text-xs">
                                        {formatDate(item.createdAt, locale)} ·{' '}
                                        {formatNumber(item.pointUsed, locale)}P
                                    </p>
                                </div>
                                <EcoBadge
                                    variant={exchangeStatusVariant(item.status)}
                                >
                                    {t(
                                        `user:shop.exchangeStatus.${EXCHANGE_STATUS_KEYS[item.status]}`,
                                    )}
                                </EcoBadge>
                            </EcoCard>
                        ))}
                    </div>
                </section>
            )}

            <nav className="border-outline-variant/30 no-scrollbar -mx-5 flex gap-4 overflow-x-auto border-b px-5 pt-2 pb-1">
                {categoryTabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveCategory(tab.key)}
                        className={cn(
                            'border-b-2 pb-3 text-sm font-bold whitespace-nowrap transition-all',
                            activeCategory === tab.key
                                ? 'border-primary text-on-surface'
                                : 'text-on-surface-variant border-transparent opacity-60',
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {rewardsLoading ? (
                <SSloadingState text={t('user:shop.loadingRewards')} />
            ) : filtered.length === 0 ? (
                <p className="text-on-surface-variant py-12 text-center text-sm">
                    {activeCategory === 'all'
                        ? t('user:shop.emptyAll')
                        : t('user:shop.emptyCategory', {
                              category: activeCategoryLabel,
                          })}
                </p>
            ) : (
                <SSstaggerChildren className="grid grid-cols-2 gap-4">
                    {filtered.map((item) => {
                        const canAfford =
                            points.currentBalance >= item.pointCost
                        return (
                            <article
                                key={item.rewardId}
                                onClick={() => {
                                    if (canAfford) {
                                        setSelectedReward(item)
                                    } else {
                                        toast.error(
                                            t(
                                                'user:shop.errorInsufficientPoints',
                                            ),
                                        )
                                    }
                                }}
                                className={cn(
                                    'group border-outline-variant bg-surface-container-lowest flex flex-col overflow-hidden rounded-2xl border transition-all active:scale-95',
                                    canAfford
                                        ? 'hover:border-primary cursor-pointer'
                                        : 'cursor-not-allowed opacity-50',
                                )}
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    {item.tag && (
                                        <EcoBadge
                                            variant="green"
                                            className="absolute top-2 left-2 z-10 px-2 py-0.5"
                                        >
                                            {item.tag}
                                        </EcoBadge>
                                    )}
                                    <RewardImage
                                        item={item}
                                        imgClassName="transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex flex-grow flex-col gap-1.5 p-3.5">
                                    <h3 className="text-on-surface line-clamp-2 text-xs leading-snug font-bold">
                                        {item.name}
                                    </h3>
                                    <div className="mt-auto">
                                        <span className="text-primary text-sm font-black">
                                            {formatNumber(item.pointCost, locale)}{' '}
                                            P
                                        </span>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </SSstaggerChildren>
            )}

            {selectedReward && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
                    onClick={() => setSelectedReward(null)}
                    role="presentation"
                >
                    <div
                        className="bg-surface w-full max-w-sm overflow-hidden rounded-2xl shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="exchange-dialog-title"
                    >
                        <div className="aspect-video w-full">
                            <RewardImage item={selectedReward} />
                        </div>
                        <div className="p-6">
                            <h3
                                id="exchange-dialog-title"
                                className="mb-2 text-lg font-bold"
                            >
                                {t('user:shop.exchangeDialogTitle')}
                            </h3>
                            <p className="text-on-surface-variant mb-1 text-sm">
                                {selectedReward.name}
                            </p>
                            <p className="text-on-surface-variant mb-4 text-xs">
                                {t('user:shop.exchangeDialogHint')}
                            </p>
                            <p className="text-primary mb-6 text-2xl font-black">
                                {formatNumber(selectedReward.pointCost, locale)} P
                            </p>
                            <div className="flex flex-col gap-2">
                                <EcoButton
                                    className="w-full py-3"
                                    disabled={exchanging}
                                    onClick={() => void handleExchange()}
                                >
                                    {exchanging
                                        ? t('common:processing')
                                        : t('user:shop.apply')}
                                </EcoButton>
                                <EcoButton
                                    variant="outline"
                                    className="w-full py-3"
                                    onClick={() => setSelectedReward(null)}
                                >
                                    {t('common:cancel')}
                                </EcoButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
