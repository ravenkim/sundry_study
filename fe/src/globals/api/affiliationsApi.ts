import client from 'src/globals/api/client'
import { unwrapApiData, withMockFallback } from 'src/globals/api/apiUtils'
import type { ApiResponse, Affiliation } from 'src/globals/api/types'

const MOCK_AFFILIATIONS: Affiliation[] = [
    {
        affiliationId: 1,
        name: '삼육대학교',
        address: '서울특별시 노원구 화랑로 815',
    },
]

export async function getAffiliations(): Promise<Affiliation[]> {
    return withMockFallback(
        async () => {
            const { data } =
                await client.get<ApiResponse<Affiliation[]>>('/api/affiliations')
            return unwrapApiData(data)
        },
        () => MOCK_AFFILIATIONS,
    )
}
