import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Crown, Medal, Trophy } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from 'src/features/auth/AuthContext'
import {
    getBuildingRanking,
    type BuildingRanking,
    type RankingPeriod,
} from 'src/globals/api/rankingApi'
import { MascotImage } from 'src/shared/components/mascort'
import { EcoBadge, EcoButton, EcoCard } from 'src/shared/ui/eco'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { getErrorMessage } from 'src/shared/lib/i18n/getErrorMessage'
import { formatKwh } from 'src/features/user/userSavingsData'

function rankIcon(rank: number) {
    if (rank === 1) return Crown
    if (rank === 2) return Medal
    if (rank === 3) return Medal
    return null
}

export function BuildingRankingBoard() {
    const { t } = useTranslation('ranking')
    const { user } = useAuth()
    const [period, setPeriod] = useState<RankingPeriod>('month')
    const [data, setData] = useState<BuildingRanking | null>(null)
    const [loading, setLoading] = useState(true)
    const [missingBuilding, setMissingBuilding] = useState(false)

    useEffect(() => {
        setLoading(true)
        setMissingBuilding(false)
        void getBuildingRanking(period)
            .then(setData)
            .catch((error) => {
                const message = getErrorMessage(error)
                if (message.includes('건물')) {
                    setMissingBuilding(true)
                    setData(null)
                    return
                }
                toast.error(message)
            })
            .finally(() => setLoading(false))
    }, [period])

    const myEntry = data?.entries.find(
        (entry) => entry.nickname === user?.nickname,
    )

    return (
        <div className="flex flex-col gap-6 p-5 pb-10">
            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Trophy className="text-primary h-5 w-5" />
                    <h2 className="text-on-surface text-lg font-black">
                        {data?.buildingName ?? user?.buildingName ?? t('title')}
                    </h2>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                    {t('description')}
                </p>
                <div className="bg-surface-container-low flex rounded-xl p-1">
                    {(['month', 'all'] as const).map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setPeriod(value)}
                            className={cn(
                                'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                                period === value
                                    ? 'bg-primary-container text-on-primary-container'
                                    : 'text-on-surface-variant hover:bg-surface-container',
                            )}
                        >
                            {t(`period.${value}`)}
                        </button>
                    ))}
                </div>
            </section>

            {loading ? (
                <EcoCard className="text-on-surface-variant p-8 text-center text-sm">
                    {t('loading')}
                </EcoCard>
            ) : missingBuilding ? (
                <EcoCard className="flex flex-col items-center gap-4 p-8 text-center">
                    <MascotImage emotion="question" size="md" decorative />
                    <div>
                        <p className="text-on-surface font-bold">
                            {t('missingBuildingTitle')}
                        </p>
                        <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
                            {t('missingBuildingDescription')}
                        </p>
                    </div>
                    <Link to="/profile/edit" className="w-full">
                        <EcoButton className="w-full">
                            {t('missingBuildingCta')}
                        </EcoButton>
                    </Link>
                </EcoCard>
            ) : data ? (
                <>
                    <EcoCard className="border-primary-container/40 bg-primary-container/10 space-y-3 p-5">
                        <p className="text-on-surface-variant text-xs font-bold tracking-wide uppercase">
                            {t('myRank.title')}
                        </p>
                        {data.myRank ? (
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-primary text-3xl font-black">
                                        #{data.myRank}
                                    </p>
                                    <p className="text-on-surface mt-1 text-base font-bold">
                                        {user?.nickname ?? t('myRank.anonymous')}
                                    </p>
                                </div>
                                {myEntry && (
                                    <div className="text-right text-sm">
                                        <p className="text-on-surface font-semibold">
                                            {t('entry.reports', {
                                                count: myEntry.reportCount,
                                            })}
                                        </p>
                                        <p className="text-secondary font-semibold">
                                            {formatKwh(myEntry.totalKwh)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-on-surface-variant text-sm">
                                {t('myRank.empty')}
                            </p>
                        )}
                    </EcoCard>

                    <section className="flex flex-col gap-3">
                        <h3 className="text-on-surface text-base font-bold">
                            {t('leaderboardTitle')}
                        </h3>
                        {data.entries.length === 0 ? (
                            <EcoCard className="text-on-surface-variant p-6 text-center text-sm">
                                {t('empty')}
                            </EcoCard>
                        ) : (
                            data.entries.map((entry) => {
                                const Icon = rankIcon(entry.rank)
                                const isMe = entry.nickname === user?.nickname

                                return (
                                    <EcoCard
                                        key={`${entry.memberSeq}-${entry.rank}`}
                                        className={cn(
                                            'flex items-center gap-3 p-4',
                                            entry.rank <= 3 &&
                                                'border-secondary/30 bg-secondary-container/10',
                                            isMe && 'ring-primary-container ring-2',
                                        )}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                                            {Icon ? (
                                                <Icon
                                                    className={cn(
                                                        'h-6 w-6',
                                                        entry.rank === 1
                                                            ? 'text-primary'
                                                            : 'text-on-surface-variant',
                                                    )}
                                                />
                                            ) : (
                                                <span className="text-on-surface-variant text-sm font-bold">
                                                    {entry.rank}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-on-surface truncate font-bold">
                                                    {entry.nickname}
                                                </p>
                                                {isMe && (
                                                    <EcoBadge variant="yellow">
                                                        {t('meBadge')}
                                                    </EcoBadge>
                                                )}
                                            </div>
                                            <p className="text-on-surface-variant text-xs">
                                                {t('entry.reports', {
                                                    count: entry.reportCount,
                                                })}{' '}
                                                · {formatKwh(entry.totalKwh)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-secondary text-sm font-bold">
                                                +{entry.pointAwarded}P
                                            </p>
                                        </div>
                                    </EcoCard>
                                )
                            })
                        )}
                    </section>
                </>
            ) : null}
        </div>
    )
}
