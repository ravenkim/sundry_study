import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoBadge, EcoCard, EcoButton } from 'src/shared/ui/eco'
import { usePoints } from 'src/features/points/PointsContext'
import { exchangeReward, getRewards } from 'src/globals/api/pointsApi'
import type { RewardItem } from 'src/globals/api/types'

const CATEGORIES = ['전체', '커피/음료', '편의점', '환경 기부'] as const

export const UserPointShop = () => {
    const { points, refresh } = usePoints()
    const [rewards, setRewards] = useState<RewardItem[]>([])
    const [activeCategory, setActiveCategory] = useState<string>('전체')
    const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null)
    const [exchanging, setExchanging] = useState(false)

    useEffect(() => {
        void getRewards().then(setRewards)
    }, [])

    const filtered =
        activeCategory === '전체'
            ? rewards
            : rewards.filter((r) => r.category === activeCategory)

    const handleExchange = async () => {
        if (!selectedReward) return
        if (points.currentBalance < selectedReward.pointCost) {
            toast.error('포인트가 부족합니다.')
            return
        }

        setExchanging(true)
        try {
            await exchangeReward(selectedReward.rewardId)
            await refresh()
            toast.success('기프티콘이 발송되었습니다.')
            setSelectedReward(null)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : '교환에 실패했습니다.')
        } finally {
            setExchanging(false)
        }
    }

    return (
        <div className="relative flex flex-col gap-6 p-5 pb-8">
            <EcoCard className="border-primary-container bg-primary-container/10 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    내 포인트
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-5xl font-black leading-none text-primary">
                        {points.currentBalance.toLocaleString()}
                    </span>
                    <span className="text-2xl font-bold text-primary">P</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-secondary" />
                    <span className="text-xs font-bold text-secondary">
                        이번 달 +{points.thisMonthEarned}P 적립
                    </span>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-on-surface-variant">
                    <span>총 획득 {points.totalEarned.toLocaleString()}P</span>
                    <span>교환 {points.totalRedeemed.toLocaleString()}P</span>
                </div>
            </EcoCard>

            <nav className="-mx-5 flex gap-4 overflow-x-auto border-b border-outline-variant/30 px-5 pb-1 pt-2 no-scrollbar">
                {CATEGORIES.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveCategory(tab)}
                        className={cn(
                            'whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-all',
                            activeCategory === tab
                                ? 'border-primary text-on-surface'
                                : 'border-transparent text-on-surface-variant opacity-60',
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="grid grid-cols-2 gap-4">
                {filtered.map((item) => {
                    const canAfford = points.currentBalance >= item.pointCost
                    return (
                        <article
                            key={item.rewardId}
                            onClick={() => canAfford && setSelectedReward(item)}
                            className={cn(
                                'group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest transition-all active:scale-95',
                                canAfford
                                    ? 'cursor-pointer hover:border-primary'
                                    : 'cursor-not-allowed opacity-50',
                            )}
                        >
                            <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                                {item.tag && (
                                    <EcoBadge
                                        variant="green"
                                        className="absolute left-2 top-2 z-10 px-2 py-0.5"
                                    >
                                        {item.tag}
                                    </EcoBadge>
                                )}
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                            </div>
                            <div className="flex flex-grow flex-col gap-1.5 p-3.5">
                                <h3 className="line-clamp-2 text-xs font-bold leading-snug text-on-surface">
                                    {item.name}
                                </h3>
                                <div className="mt-auto">
                                    <span className="text-sm font-black text-primary">
                                        {item.pointCost.toLocaleString()} P
                                    </span>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>

            {selectedReward && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
                    <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">
                        <h3 className="mb-2 text-lg font-bold">교환 확인</h3>
                        <p className="mb-1 text-sm text-on-surface-variant">{selectedReward.name}</p>
                        <p className="mb-6 text-2xl font-black text-primary">
                            {selectedReward.pointCost.toLocaleString()} P
                        </p>
                        <div className="flex flex-col gap-2">
                            <EcoButton
                                className="w-full py-3"
                                disabled={exchanging}
                                onClick={() => void handleExchange()}
                            >
                                {exchanging ? '처리 중...' : '교환하기'}
                            </EcoButton>
                            <EcoButton
                                variant="outline"
                                className="w-full py-3"
                                onClick={() => setSelectedReward(null)}
                            >
                                취소
                            </EcoButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
