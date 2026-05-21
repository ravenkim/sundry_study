import client from 'src/globals/api/client'
import { unwrapApiData, withMockFallback } from 'src/globals/api/apiUtils'
import { MOCK_BUILDINGS } from 'src/globals/api/mock/data'
import type { ApiResponse, Building } from 'src/globals/api/types'

export async function getBuildings(): Promise<Building[]> {
    return withMockFallback(
        async () => {
            const { data } = await client.get<ApiResponse<Building[]>>('/api/buildings')
            return unwrapApiData(data)
        },
        () => MOCK_BUILDINGS,
    )
}

export async function createBuilding(payload: {
    name: string
    roomCount: number
}): Promise<Building> {
    return withMockFallback(
        async () => {
            const { data } = await client.post<ApiResponse<Building>>(
                '/api/admin/buildings',
                payload,
            )
            return unwrapApiData(data)
        },
        () => ({
            buildingId: Date.now(),
            name: payload.name,
            locations: [],
        }),
    )
}
