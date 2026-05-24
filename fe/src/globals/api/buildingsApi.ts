import client from 'src/globals/api/client'
import { unwrapApiListData, withMockFallback } from 'src/globals/api/apiUtils'
import { MOCK_BUILDINGS } from 'src/globals/api/mock/data'
import type { ApiResponse, Building } from 'src/globals/api/types'

export async function getBuildings(): Promise<Building[]> {
    return withMockFallback(
        async () => {
            const { data } =
                await client.get<ApiResponse<Building[]>>('/api/buildings')
            return unwrapApiListData(data)
        },
        () => MOCK_BUILDINGS,
    )
}
