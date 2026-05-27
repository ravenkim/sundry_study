import client from 'src/globals/api/client'
import { unwrapApiData } from 'src/globals/api/apiUtils'
import type { ApiResponse } from 'src/globals/api/types'

export type RankingPeriod = 'month' | 'all'

export interface AffiliationRankingEntry {
    rank: number
    memberSeq: number
    nickname: string
    reportCount: number
    totalKwh: number
    pointAwarded: number
}

export interface AffiliationRanking {
    affiliationId: number
    affiliationName: string
    period: RankingPeriod
    myRank: number | null
    entries: AffiliationRankingEntry[]
}

export async function getAffiliationRanking(
    period: RankingPeriod = 'month',
): Promise<AffiliationRanking> {
    const { data } = await client.get<ApiResponse<AffiliationRanking>>(
        '/api/rankings/affiliation/me',
        { params: { period } },
    )
    return unwrapApiData(data)
}
