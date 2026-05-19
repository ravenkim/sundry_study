/** 사용자가 제보에 참여한 건물별 절약 전기 (데모·API 연동 전 목 데이터) */
export type ParticipatedBuildingSavings = {
    buildingId: string
    buildingName: string
    /** 누적 절약 전기 (kWh) */
    totalKwh: number
    /** 이번 달 절약 전기 (kWh) */
    thisMonthKwh: number
    reportCount: number
}

export const PARTICIPATED_BUILDING_SAVINGS: ParticipatedBuildingSavings[] = [
    {
        buildingId: '1',
        buildingName: '공학관 A동',
        totalKwh: 86.4,
        thisMonthKwh: 52.1,
        reportCount: 8,
    },
    {
        buildingId: '2',
        buildingName: '도서관',
        totalKwh: 41.2,
        thisMonthKwh: 28.6,
        reportCount: 5,
    },
    {
        buildingId: '3',
        buildingName: '학생회관',
        totalKwh: 19.8,
        thisMonthKwh: 12.3,
        reportCount: 2,
    },
]

const KWH_PER_TREE_GROUP = 20.25

export function sumParticipatedKwh(
    buildings: ParticipatedBuildingSavings[],
    period: 'total' | 'month',
): number {
    return buildings.reduce(
        (sum, b) => sum + (period === 'total' ? b.totalKwh : b.thisMonthKwh),
        0,
    )
}

export function formatKwh(kwh: number): string {
    return kwh >= 100 ? kwh.toFixed(0) : kwh.toFixed(1)
}

export function getTreeEquivalent(kwh: number): number {
    return Math.max(1, Math.round(kwh / KWH_PER_TREE_GROUP))
}
