import { Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoCard } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'
import {
    formatCo2Kg,
    formatKwh,
    getCo2KgFromKwh,
    getParticipatedSavingsMascotEmotion,
    getTreeEquivalent,
    sumParticipatedKwh,
} from './userSavingsData'
import { useMyBuildingSavings } from './useMyBuildingSavings'

type Props = {
    compact?: boolean
    className?: string
}

export const ParticipatedBuildingSavingsCard = ({
    compact = false,
    className,
}: Props) => {
    const { t } = useTranslation(['user', 'common'])
    const [expanded, setExpanded] = useState(!compact)
    const { buildings, loading } = useMyBuildingSavings()
    const totalKwh = sumParticipatedKwh(buildings, 'total')
    const monthKwh = sumParticipatedKwh(buildings, 'month')
    const maxMonthKwh = Math.max(...buildings.map((b) => b.thisMonthKwh), 1)
    const monthCo2Kg = getCo2KgFromKwh(monthKwh)
    const monthTrees = getTreeEquivalent(monthKwh)
    const totalCo2Kg = getCo2KgFromKwh(totalKwh)
    const totalTrees = getTreeEquivalent(totalKwh)
    const mascotEmotion = getParticipatedSavingsMascotEmotion(buildings)
    const isSingleBuilding = buildings.length <= 1

    return (
        <EcoCard className={cn('relative overflow-hidden', className)}>
            <div
                className="bg-secondary absolute top-0 left-0 h-full w-1"
                aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-on-surface-variant text-sm font-medium">
                        {isSingleBuilding
                            ? t('savings.titleSingle')
                            : t('savings.titleMultiple')}
                    </span>
                    {compact && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="text-primary flex items-center gap-0.5 text-xs font-bold"
                            aria-expanded={expanded}
                        >
                            {t('savings.buildingCount', {
                                count: buildings.length,
                            })}
                            {expanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                            )}
                        </button>
                    )}
                </div>

                <div className="flex justify-center py-2">
                    <MascotImage
                        emotion={mascotEmotion}
                        size="md"
                        decorative
                        className="h-60 w-60"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant text-xs font-medium">
                        {isSingleBuilding
                            ? t('savings.cumulativeSingle')
                            : t('savings.cumulativeMultiple')}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-secondary text-3xl font-bold">
                            🌿{' '}
                            {loading
                                ? '—'
                                : t('savings.kwhValue', {
                                      value: formatKwh(totalKwh),
                                  })}
                        </span>
                    </div>
                    <span className="text-secondary text-xs font-medium">
                        {loading
                            ? t('common:loading')
                            : t('savings.monthlySummary', {
                                  monthKwh: formatKwh(monthKwh),
                                  co2Kg: formatCo2Kg(monthCo2Kg),
                                  trees: monthTrees,
                              })}
                    </span>
                    {!loading && totalKwh > 0 && (
                        <span className="text-on-surface-variant text-[11px]">
                            {t('savings.cumulativeImpact', {
                                co2Kg: formatCo2Kg(totalCo2Kg),
                                trees: totalTrees,
                            })}
                        </span>
                    )}
                </div>

                {expanded && !loading && buildings.length === 0 && (
                    <p className="text-on-surface-variant border-outline-variant/60 border-t pt-3 text-center text-sm">
                        {t('savings.empty')}
                    </p>
                )}

                {expanded && buildings.length > 0 && (
                    <ul className="border-outline-variant/60 flex flex-col gap-2 border-t pt-1">
                        {buildings.map((building) => (
                            <li
                                key={building.buildingId}
                                className="flex flex-col gap-1.5 py-2 first:pt-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-1.5">
                                        <Building2 className="text-on-surface-variant h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate text-sm font-bold">
                                            {building.buildingName}
                                        </span>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <span className="text-secondary text-sm font-bold">
                                            {t('savings.kwhValue', {
                                                value: formatKwh(
                                                    building.totalKwh,
                                                ),
                                            })}
                                        </span>
                                        <p className="text-on-surface-variant text-[10px]">
                                            {t('savings.buildingMonthly', {
                                                kwh: formatKwh(
                                                    building.thisMonthKwh,
                                                ),
                                                count: building.reportCount,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-surface-container-high h-1.5 w-full overflow-hidden rounded-full">
                                    <div
                                        className="bg-secondary h-full rounded-full transition-all"
                                        style={{
                                            width: `${(building.thisMonthKwh / maxMonthKwh) * 100}%`,
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </EcoCard>
    )
}
