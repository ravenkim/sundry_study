import client from 'src/globals/api/client'
import { unwrapApiData, withMockFallback } from 'src/globals/api/apiUtils'
import {
    getMockPoints,
    MOCK_REWARDS,
    updateMockPointsAfterExchange,
} from 'src/globals/api/mock/data'
import type {
    ApiResponse,
    ExchangeResult,
    PointsSummary,
    RewardItem,
} from 'src/globals/api/types'

export async function getMyPoints(): Promise<PointsSummary> {
    return withMockFallback(
        async () => {
            const { data } =
                await client.get<ApiResponse<PointsSummary>>('/api/points/me')
            return unwrapApiData(data)
        },
        () => getMockPoints(),
    )
}

export async function getRewards(): Promise<RewardItem[]> {
    return withMockFallback(
        async () => {
            const { data } =
                await client.get<ApiResponse<RewardItem[]>>('/api/rewards')
            return unwrapApiData(data)
        },
        () => MOCK_REWARDS,
    )
}

export async function exchangeReward(
    rewardId: number,
    quantity = 1,
): Promise<ExchangeResult> {
    return withMockFallback(
        async () => {
            const { data } = await client.post<ApiResponse<ExchangeResult>>(
                '/api/points/exchange',
                { rewardId, quantity },
            )
            return unwrapApiData(data)
        },
        () => {
            const reward = MOCK_REWARDS.find((r) => r.rewardId === rewardId)
            if (!reward) throw new Error('리워드를 찾을 수 없습니다.')
            const pointUsed = reward.pointCost * quantity
            const points = getMockPoints()
            if (points.currentBalance < pointUsed) {
                throw new Error('포인트가 부족합니다.')
            }
            const updated = updateMockPointsAfterExchange(pointUsed)
            return {
                transactionId: Date.now(),
                rewardName: reward.name,
                pointUsed,
                remainingBalance: updated.currentBalance,
            }
        },
    )
}
