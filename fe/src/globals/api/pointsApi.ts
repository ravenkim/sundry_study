import client from 'src/globals/api/client'
import { unwrapApiData, withMockFallback } from 'src/globals/api/apiUtils'
import {
    createMockGifticonExchange,
    getMockMyGifticonExchanges,
    getMockPoints,
    MOCK_REWARDS,
} from 'src/globals/api/mock/data'
import type {
    ApiResponse,
    ExchangeResult,
    GifticonExchangeRow,
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
            const exchange = createMockGifticonExchange(rewardId, quantity)
            return {
                transactionId: exchange.exchangeId,
                rewardName: exchange.rewardName,
                pointUsed: exchange.pointUsed,
                remainingBalance: getMockPoints().currentBalance,
                status: exchange.status,
            }
        },
    )
}

export async function getMyGifticonExchanges(): Promise<GifticonExchangeRow[]> {
    return withMockFallback(
        async () => {
            const { data } = await client.get<ApiResponse<GifticonExchangeRow[]>>(
                '/api/points/exchanges/me',
            )
            return unwrapApiData(data)
        },
        () => getMockMyGifticonExchanges(),
    )
}
