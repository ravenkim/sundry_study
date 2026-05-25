import client from 'src/globals/api/client'
import { unwrapApiData } from 'src/globals/api/apiUtils'
import type { ApiResponse } from 'src/globals/api/types'

export type RankingPeriod = 'month' | 'all'

export interface BuildingRankingEntry {
    rank: number
    memberSeq: number
    nickname: string
    reportCount: number
    totalKwh: number
    pointAwarded: number
}

export interface BuildingRanking {
    buildingId: number
    buildingName: string
    period: RankingPeriod
    myRank: number | null
    entries: BuildingRankingEntry[]
}

export async function getBuildingRanking(
    period: RankingPeriod = 'month',
): Promise<BuildingRanking> {
    const { data } = await client.get<ApiResponse<BuildingRanking>>(
        '/api/rankings/building/me',
        { params: { period } },
    )
    return unwrapApiData(data)
}
