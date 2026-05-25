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

/** kWh → CO₂(kg), 한국 전력 평균 배출계수 — BE `EnergyConstants.CO2_KG_PER_KWH` */
export const CO2_KG_PER_KWH = 0.4594

/**
 * kWh → 소나무 흡수량 환산 (그루)
 * 와이어프레임 기준 243 kWh ≈ 12그루 → 243 / 12 = 20.25 kWh/그루
 */
export const KWH_PER_TREE = 20.25

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

export function formatCo2Kg(kg: number): string {
    if (kg <= 0) return '0'
    return kg >= 100 ? kg.toFixed(0) : kg.toFixed(1)
}

/** 절약 전기(kWh) → 절약 탄소(kg CO₂) */
export function getCo2KgFromKwh(kwh: number): number {
    if (kwh <= 0) return 0
    return Math.round(kwh * CO2_KG_PER_KWH * 10) / 10
}

/** 절약 전기(kWh) → 소나무 흡수량 환산(그루) */
export function getTreeEquivalent(kwh: number): number {
    if (kwh <= 0) return 0
    return Math.round(kwh / KWH_PER_TREE)
}

/** 참여 건물 절약 상태 — 이번 달 절약이 있으면 긍정, 없으면 아쉬움 */
export function getParticipatedSavingsMascotEmotion(
    buildings: ParticipatedBuildingSavings[],
): 'smile' | 'sad' {
    if (buildings.length === 0) return 'sad'
    return sumParticipatedKwh(buildings, 'month') > 0 ? 'smile' : 'sad'
}
