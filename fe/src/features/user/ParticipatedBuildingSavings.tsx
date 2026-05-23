import { Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoCard } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'
import { useAuth } from 'src/features/auth/AuthContext'
import {
    formatKwh,
    getParticipatedSavingsMascotEmotion,
    getTreeEquivalent,
    PARTICIPATED_BUILDING_SAVINGS,
    sumParticipatedKwh,
} from './userSavingsData'

type Props = {
    compact?: boolean
    className?: string
}

export const ParticipatedBuildingSavingsCard = ({
    compact = false,
    className,
}: Props) => {
    const { user } = useAuth()
    const [expanded, setExpanded] = useState(!compact)
    const buildings = useMemo(() => {
        if (!user?.buildingId && !user?.buildingName) {
            return PARTICIPATED_BUILDING_SAVINGS
        }
        return PARTICIPATED_BUILDING_SAVINGS.filter(
            (building) =>
                (user.buildingId != null &&
                    String(building.buildingId) === String(user.buildingId)) ||
                building.buildingName === user.buildingName,
        )
    }, [user?.buildingId, user?.buildingName])
    const totalKwh = sumParticipatedKwh(buildings, 'total')
    const monthKwh = sumParticipatedKwh(buildings, 'month')
    const maxMonthKwh = Math.max(...buildings.map((b) => b.thisMonthKwh), 1)
    const trees = getTreeEquivalent(totalKwh)
    const mascotEmotion = getParticipatedSavingsMascotEmotion(buildings)

    return (
        <EcoCard className={cn('relative overflow-hidden', className)}>
            <div
                className="bg-secondary absolute top-0 left-0 h-full w-1"
                aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-on-surface-variant text-sm font-medium">
                        {buildings.length <= 1 ? '내 건물 절약 전기' : '참여 건물 절약 전기'}
                    </span>
                    {compact && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="text-primary flex items-center gap-0.5 text-xs font-bold"
                            aria-expanded={expanded}
                        >
                            {buildings.length}개 건물
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
                        {buildings.length <= 1 ? '내 건물 누적 절약 전기' : '참여 건물 누적 절약 전기'}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-secondary text-3xl font-bold">
                            🌿 {formatKwh(totalKwh)} kWh
                        </span>
                    </div>
                    <span className="text-secondary text-xs font-medium">
                        이번 달 +{formatKwh(monthKwh)} kWh · 🌲 소나무 {trees}
                        그루 흡수량과 동등
                    </span>
                </div>

                {expanded && (
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
                                            {formatKwh(building.totalKwh)} kWh
                                        </span>
                                        <p className="text-on-surface-variant text-[10px]">
                                            이번 달{' '}
                                            {formatKwh(building.thisMonthKwh)}{' '}
                                            kWh · 제보 {building.reportCount}건
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
