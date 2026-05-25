const PENDING_AFFILIATION_KEY = 'ecoreport_pending_affiliation_id'
const PENDING_AFFILIATION_NAME_KEY = 'ecoreport_pending_affiliation_name'
const PENDING_BUILDING_KEY = 'ecoreport_pending_building_id'

export interface PendingAffiliation {
    affiliationId: number
    affiliationName?: string
    /** @deprecated 회원가입 시 더 이상 설정하지 않음 */
    buildingId?: number
    /** @deprecated 회원가입 시 더 이상 설정하지 않음 */
    buildingName?: string
}

export function setPendingAffiliation(
    affiliationId: number,
    affiliationName?: string,
): void {
    sessionStorage.setItem(PENDING_AFFILIATION_KEY, String(affiliationId))
    sessionStorage.removeItem(PENDING_BUILDING_KEY)
    sessionStorage.removeItem('ecoreport_pending_building_name')
    if (affiliationName) {
        sessionStorage.setItem(PENDING_AFFILIATION_NAME_KEY, affiliationName)
    } else {
        sessionStorage.removeItem(PENDING_AFFILIATION_NAME_KEY)
    }
}

export function getPendingAffiliation(): PendingAffiliation | null {
    const affiliationRaw = sessionStorage.getItem(PENDING_AFFILIATION_KEY)
    if (!affiliationRaw) return null

    const affiliationId = Number(affiliationRaw)
    if (!Number.isFinite(affiliationId)) return null

    const affiliationName =
        sessionStorage.getItem(PENDING_AFFILIATION_NAME_KEY) ?? undefined
    const buildingRaw = sessionStorage.getItem(PENDING_BUILDING_KEY)
    const buildingName =
        sessionStorage.getItem('ecoreport_pending_building_name') ?? undefined
    if (!buildingRaw) {
        return { affiliationId, affiliationName, buildingName }
    }

    const buildingId = Number(buildingRaw)
    return Number.isFinite(buildingId)
        ? { affiliationId, affiliationName, buildingId, buildingName }
        : { affiliationId, affiliationName, buildingName }
}

/** @deprecated use getPendingAffiliation */
export function getPendingBuildingId(): number | null {
    return getPendingAffiliation()?.buildingId ?? null
}

/** @deprecated use setPendingAffiliation */
export function setPendingBuildingId(buildingId: number): void {
    sessionStorage.setItem(PENDING_BUILDING_KEY, String(buildingId))
}

export function clearPendingAffiliation(): void {
    sessionStorage.removeItem(PENDING_AFFILIATION_KEY)
    sessionStorage.removeItem(PENDING_AFFILIATION_NAME_KEY)
    sessionStorage.removeItem(PENDING_BUILDING_KEY)
    sessionStorage.removeItem('ecoreport_pending_building_name')
}

/** @deprecated use clearPendingAffiliation */
export function clearPendingBuildingId(): void {
    clearPendingAffiliation()
}
