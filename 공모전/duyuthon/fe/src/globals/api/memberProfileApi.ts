import client from 'src/globals/api/client'
import { unwrapApiData } from 'src/globals/api/apiUtils'
import type { ApiResponse } from 'src/globals/api/types'

export interface MemberProfile {
    memberSeq: number
    userName: string
    nickname?: string
    email?: string
    phoneNumber?: string
    affiliationId?: number
    affiliationName?: string
    buildingId?: number
    buildingName?: string
    userType?: 'USER' | 'ADMIN'
    provider?: string
}

export interface UpdateProfileRequest {
    nickname?: string
    email?: string
    phoneNumber?: string
    currentPassword?: string
    password?: string
}

export interface AssignAffiliationRequest {
    affiliationId: number
    buildingId?: number
    nickname?: string
}

export interface AssignBuildingRequest {
    buildingId: number
}

export async function getMyProfile(): Promise<MemberProfile> {
    const { data } = await client.get<ApiResponse<MemberProfile>>('/api/me')
    return unwrapApiData(data)
}

export async function updateProfile(
    request: UpdateProfileRequest,
): Promise<MemberProfile> {
    const { data } = await client.patch<ApiResponse<MemberProfile>>(
        '/api/me/profile',
        request,
    )
    return unwrapApiData(data)
}

export async function assignAffiliation(
    request: AssignAffiliationRequest,
): Promise<MemberProfile> {
    const { data } = await client.patch<ApiResponse<MemberProfile>>(
        '/api/me/affiliation',
        request,
    )
    return unwrapApiData(data)
}

export async function assignBuilding(
    request: AssignBuildingRequest,
): Promise<MemberProfile> {
    const { data } = await client.patch<ApiResponse<MemberProfile>>(
        '/api/me/building',
        request,
    )
    return unwrapApiData(data)
}
