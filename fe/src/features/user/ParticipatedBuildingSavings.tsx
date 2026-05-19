import { Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoCard } from 'src/shared/ui/eco'
import {
    formatKwh,
    getTreeEquivalent,
    PARTICIPATED_BUILDING_SAVINGS,
    sumParticipatedKwh,
} from './userSavingsData'

type Props = {
    compact?: boolean
    className?: string
}

export const ParticipatedBuildingSavingsCard = ({ compact = false, className }: Props) => {
    const [expanded, setExpanded] = useState(!compact)
    const buildings = PARTICIPATED_BUILDING_SAVINGS
    const totalKwh = sumParticipatedKwh(buildings, 'total')
    const monthKwh = sumParticipatedKwh(buildings, 'month')
    const maxMonthKwh = Math.max(...buildings.map((b) => b.thisMonthKwh), 1)
    const trees = getTreeEquivalent(totalKwh)

    return (
        <EcoCard className={cn('relative overflow-hidden', className)}>
            <div className="absolute top-0 left-0 w-1 h-full bg-secondary" aria-hidden="true" />
            <div className="flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-center gap-2">
                    <span className="text-sm text-on-surface-variant font-medium">
                        참여 건물 절약 전기
                    </span>
                    {compact && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="text-xs font-bold text-primary flex items-center gap-0.5"
                            aria-expanded={expanded}
                        >
                            {buildings.length}개 건물
                            {expanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                            )}
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs text-on-surface-variant font-medium">
                        참여 건물 누적 절약 전기
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-secondary">
                            🌿 {formatKwh(totalKwh)} kWh
                        </span>
                    </div>
                    <span className="text-xs text-secondary font-medium">
                        이번 달 +{formatKwh(monthKwh)} kWh · 🌲 소나무 {trees}그루 흡수량과 동등
                    </span>
                </div>

                {expanded && (
                    <ul className="flex flex-col gap-2 pt-1 border-t border-outline-variant/60">
                        {buildings.map((building) => (
                            <li
                                key={building.buildingId}
                                className="flex flex-col gap-1.5 py-2 first:pt-3"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <Building2 className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                                        <span className="text-sm font-bold truncate">
                                            {building.buildingName}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-sm font-bold text-secondary">
                                            {formatKwh(building.totalKwh)} kWh
                                        </span>
                                        <p className="text-[10px] text-on-surface-variant">
                                            이번 달 {formatKwh(building.thisMonthKwh)} kWh · 제보{' '}
                                            {building.reportCount}건
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
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
