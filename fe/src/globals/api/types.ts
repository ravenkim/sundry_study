export interface ApiResponse<T = unknown> {
    code: number | string
    body?: T
    data?: T
}

export interface ApiErrorResponse {
    code: number | string
    message: string
}

export const ResponseCode = {
    OK: 10000,
    LOGIN_SUCCESS: 10001,
    REGISTER_SUCCESS: 10002,
} as const

export function isApiError(data: unknown): data is ApiErrorResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as ApiErrorResponse).message === 'string'
    )
}

export type ReportStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNDETECTABLE'

export type AiResultType = 'WASTE_DETECTED' | 'PASS' | 'ERROR'

export interface AiReportResult {
    result: AiResultType
    message: string
    ac_status?: 'ON' | 'OFF' | 'UNKNOWN'
    light_status?: 'ON' | 'OFF' | 'UNKNOWN'
    reason?: string
    expected?: string
    expectedKwh?: string
    pointAwarded?: number
    currentBalance?: number
}

export interface ReportSummary {
    reportId: number
    roomName: string
    status: ReportStatus
    pointAwarded: number
    estimatedPoint?: number
    offTimeMinutes?: number
    estimatedKwh?: string
    createdAt: string
    detectionLabel?: string
    thumbnailUrl?: string
}

export interface ReportDetail extends ReportSummary {
    buildingName?: string
    aiResult?: AiReportResult
    imageUrl?: string
}

export interface PaginatedReports {
    content: ReportSummary[]
    totalElements: number
    totalPages: number
    page: number
    size: number
}

export interface PointsSummary {
    currentBalance: number
    thisMonthEarned: number
    totalEarned: number
    totalRedeemed: number
}

export interface RewardItem {
    rewardId: number
    name: string
    pointCost: number
    category: string
    imageUrl?: string
    imageKey?: string
    tag?: string
}

export interface ExchangeResult {
    transactionId: number
    rewardName: string
    pointUsed: number
    remainingBalance: number
    status: GifticonExchangeStatus
}

export type GifticonExchangeStatus = 'PENDING' | 'SENT' | 'REJECTED'

export interface GifticonExchangeRow {
    exchangeId: number
    memberName: string
    memberPhone: string
    rewardName: string
    pointUsed: number
    status: GifticonExchangeStatus
    createdAt: string
    processedAt?: string
}

export type NodeKind = 'GROUP' | 'LEAF'

export interface LocationTreeNode {
    locationId: number
    name: string
    nodeKind: NodeKind
    children?: LocationTreeNode[]
}

export interface BuildingLocation {
    locationId: number
    name: string
    path?: string
}

export interface Building {
    buildingId: number
    name: string
    nodeKind: NodeKind
    affiliationId?: number
    affiliationName?: string
    children: LocationTreeNode[]
}

export interface AdminLocationNode {
    id: number
    name: string
    nodeKind: NodeKind
    depth: number
    sortOrder: number
    locationType?: string
    acCount: number
    fluorescentCount: number
    ledCount: number
    operatingSchedules?: OperatingScheduleItem[]
    children: AdminLocationNode[]
}

export type OperatingScheduleItem = {
    dayOfWeek: number
    closed: boolean
    powerOnTime?: string
    powerOffTime?: string
}

export type LocationResourceCounts = {
    acCount: number
    fluorescentCount: number
    ledCount: number
}

export type LocationLeafPayload = LocationResourceCounts & {
    operatingSchedules?: OperatingScheduleItem[]
}

export interface Affiliation {
    affiliationId: number
    name: string
    address?: string
}

export interface AdminReportRow {
    reportId: number
    buildingName: string
    roomName: string
    /** 전체 경로 (예: 공학관 A동 > 2층 > 303호). 없으면 buildingName + roomName 사용 */
    locationPath?: string
    memberName: string
    status: ReportStatus
    aiResult: string
    pointAwarded: number
    createdAt: string
    imageUrl?: string
}

export interface AdminDashboardStats {
    todayReports: number
    pendingReports: number
    totalCo2SavedKg: number
    monthlyReports: number
    monthlySavingsKrw: number
}

export interface CreateReportPayload {
    image: File
    buildingId?: number
    buildingName?: string
    locationId?: number
    roomName?: string
}

export interface CreateReportResponse {
    reportId?: number
    reportSeq?: number
    status: ReportStatus | 'PENDING'
    aiResult?: AiReportResult
}
