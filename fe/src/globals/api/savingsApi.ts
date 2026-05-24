import client from 'src/globals/api/client'
import { unwrapApiListData, withMockFallback } from 'src/globals/api/apiUtils'
import { PARTICIPATED_BUILDING_SAVINGS } from 'src/features/user/userSavingsData'
import type { ParticipatedBuildingSavings } from 'src/features/user/userSavingsData'
import type { ApiResponse } from 'src/globals/api/types'

type BuildingSavingsApiItem = {
    buildingId: number
    buildingName: string
    totalKwh: number
    thisMonthKwh: number
    reportCount: number
}

function toParticipatedBuildingSavings(
    item: BuildingSavingsApiItem,
): ParticipatedBuildingSavings {
    return {
        buildingId: String(item.buildingId),
        buildingName: item.buildingName,
        totalKwh: item.totalKwh,
        thisMonthKwh: item.thisMonthKwh,
        reportCount: item.reportCount,
    }
}

export async function getMyBuildingSavings(): Promise<
    ParticipatedBuildingSavings[]
> {
    return withMockFallback(
        async () => {
            const { data } = await client.get<
                ApiResponse<BuildingSavingsApiItem[]>
            >('/api/savings/buildings/me')
            return unwrapApiListData<BuildingSavingsApiItem>(data).map(
                toParticipatedBuildingSavings,
            )
        },
        () => PARTICIPATED_BUILDING_SAVINGS,
    )
}
