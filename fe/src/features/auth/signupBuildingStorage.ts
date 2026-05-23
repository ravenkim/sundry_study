import client from 'src/globals/api/client'
import { unwrapApiData } from 'src/globals/api/apiUtils'
import type { ApiResponse } from 'src/globals/api/types'

const PENDING_AFFILIATION_KEY = 'ecoreport_pending_affiliation_id'
const PENDING_BUILDING_KEY = 'ecoreport_pending_building_id'

export interface PendingAffiliation {
    affiliationId: number
    buildingId?: number
    buildingName?: string
}

export function setPendingAffiliation(
    affiliationId: number,
    buildingId?: number,
    buildingName?: string,
): void {
    sessionStorage.setItem(PENDING_AFFILIATION_KEY, String(affiliationId))
    if (buildingId != null) {
        sessionStorage.setItem(PENDING_BUILDING_KEY, String(buildingId))
    } else {
        sessionStorage.removeItem(PENDING_BUILDING_KEY)
    }
    if (buildingName) {
        sessionStorage.setItem('ecoreport_pending_building_name', buildingName)
    } else {
        sessionStorage.removeItem('ecoreport_pending_building_name')
    }
}

export function getPendingAffiliation(): PendingAffiliation | null {
    const affiliationRaw = sessionStorage.getItem(PENDING_AFFILIATION_KEY)
    if (!affiliationRaw) return null

    const affiliationId = Number(affiliationRaw)
    if (!Number.isFinite(affiliationId)) return null

    const buildingRaw = sessionStorage.getItem(PENDING_BUILDING_KEY)
    const buildingName =
        sessionStorage.getItem('ecoreport_pending_building_name') ?? undefined
    if (!buildingRaw) {
        return { affiliationId, buildingName }
    }

    const buildingId = Number(buildingRaw)
    return Number.isFinite(buildingId)
        ? { affiliationId, buildingId, buildingName }
        : { affiliationId, buildingName }
}

/** @deprecated use getPendingAffiliation */
export function getPendingBuildingId(): number | null {
    return getPendingAffiliation()?.buildingId ?? null
}

/** @deprecated use setPendingAffiliation */
export function setPendingBuildingId(buildingId: number): void {
    const pending = getPendingAffiliation()
    if (pending) {
        setPendingAffiliation(pending.affiliationId, buildingId)
        return
    }
    sessionStorage.setItem(PENDING_BUILDING_KEY, String(buildingId))
}

export function clearPendingAffiliation(): void {
    sessionStorage.removeItem(PENDING_AFFILIATION_KEY)
    sessionStorage.removeItem(PENDING_BUILDING_KEY)
    sessionStorage.removeItem('ecoreport_pending_building_name')
}

/** @deprecated use clearPendingAffiliation */
export function clearPendingBuildingId(): void {
    clearPendingAffiliation()
}

export async function assignAffiliationToMember(
    affiliationId: number,
    buildingId?: number,
): Promise<void> {
    const { data } = await client.patch<ApiResponse<unknown>>(
        '/api/me/affiliation',
        { affiliationId, buildingId },
    )
    unwrapApiData(data)
}

export async function applyPendingAffiliationIfNeeded(): Promise<void> {
    const pending = getPendingAffiliation()
    if (!pending) return

    try {
        await assignAffiliationToMember(
            pending.affiliationId,
            pending.buildingId,
        )
    } finally {
        clearPendingAffiliation()
    }
}

/** @deprecated use applyPendingAffiliationIfNeeded */
export async function applyPendingBuildingIfNeeded(): Promise<void> {
    await applyPendingAffiliationIfNeeded()
}
