import client from 'src/globals/api/client'
import { unwrapApiData, unwrapApiListData } from 'src/globals/api/apiUtils'
import type {
    AdminLocationNode,
    ApiResponse,
    NodeKind,
    OperatingScheduleItem,
} from 'src/globals/api/types'

export async function getLocationNodeTree(
    affiliationId: number,
): Promise<AdminLocationNode[]> {
    const { data } = await client.get<ApiResponse<AdminLocationNode[]>>(
        '/api/admin/location-nodes/tree',
        { params: { affiliationId } },
    )
    return unwrapApiListData(data)
}

export async function createLocationNode(payload: {
    parentId?: number
    affiliationId: number
    name: string
    nodeKind: NodeKind
    acCount?: number
    fluorescentCount?: number
    ledCount?: number
    operatingSchedules?: OperatingScheduleItem[]
}): Promise<AdminLocationNode> {
    const { data } = await client.post<ApiResponse<AdminLocationNode>>(
        '/api/admin/location-nodes',
        payload,
    )
    return unwrapApiData(data)
}

export async function updateLocationNode(
    id: number,
    payload: {
        name: string
        acCount?: number
        fluorescentCount?: number
        ledCount?: number
        operatingSchedules?: OperatingScheduleItem[]
    },
): Promise<AdminLocationNode> {
    const { data } = await client.patch<ApiResponse<AdminLocationNode>>(
        `/api/admin/location-nodes/${id}`,
        payload,
    )
    return unwrapApiData(data)
}

export async function deleteLocationNode(id: number): Promise<void> {
    const { data } = await client.delete<ApiResponse<void>>(
        `/api/admin/location-nodes/${id}`,
    )
    unwrapApiData(data)
}
