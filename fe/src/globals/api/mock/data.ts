import type {
    AdminDashboardStats,
    AdminReportRow,
    Building,
    PaginatedReports,
    PointsSummary,
    ReportDetail,
    ReportStatus,
    RewardItem,
} from 'src/globals/api/types'

export const MOCK_POINTS: PointsSummary = {
    currentBalance: 370,
    thisMonthEarned: 220,
    totalEarned: 1240,
    totalRedeemed: 781,
}

export const MOCK_BUILDINGS: Building[] = [
    {
        buildingId: 1,
        name: '공학관 A동',
        locations: [
            { locationId: 101, name: '303호' },
            { locationId: 102, name: '304호' },
            { locationId: 103, name: '2층 복도' },
        ],
    },
    {
        buildingId: 2,
        name: '도서관',
        locations: [
            { locationId: 201, name: '2열람실' },
            { locationId: 202, name: '3열람실' },
        ],
    },
    {
        buildingId: 3,
        name: '학생회관',
        locations: [
            { locationId: 301, name: '101호' },
            { locationId: 302, name: '201호' },
        ],
    },
    {
        buildingId: 4,
        name: '본관',
        locations: [
            { locationId: 401, name: '501호' },
            { locationId: 402, name: '502호' },
        ],
    },
]

export const MOCK_REWARDS: RewardItem[] = [
    {
        rewardId: 1,
        name: '스타벅스 아이스 아메리카노 T',
        pointCost: 500,
        category: '커피/음료',
        imageUrl:
            'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200',
    },
    {
        rewardId: 2,
        name: 'GS25 모바일 상품권 3천원',
        pointCost: 300,
        category: '편의점',
        imageUrl:
            'https://images.unsplash.com/photo-1542382257-80dee8dabc95?auto=format&fit=crop&q=80&w=200',
    },
    {
        rewardId: 3,
        name: '학식 포인트 100원',
        pointCost: 100,
        category: '편의점',
        imageUrl:
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200',
    },
    {
        rewardId: 4,
        name: '지구온난화 방지 기금 기부',
        pointCost: 1000,
        category: '환경 기부',
        imageUrl:
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200',
        tag: '기부',
    },
]

const MOCK_REPORTS_RAW: ReportDetail[] = [
    {
        reportId: 42,
        roomName: '공학관 A동 303호',
        buildingName: '공학관 A동',
        status: 'APPROVED',
        pointAwarded: 89,
        createdAt: '2026-05-20T14:03:22',
        detectionLabel: '조명 켜짐 감지',
        thumbnailUrl:
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200',
        aiResult: {
            result: 'WASTE_DETECTED',
            message: '빈 강의실에서 조명이 켜져 있습니다.',
            light_status: 'ON',
            ac_status: 'OFF',
            pointAwarded: 89,
        },
    },
    {
        reportId: 41,
        roomName: '도서관 2열람실',
        buildingName: '도서관',
        status: 'PENDING',
        pointAwarded: 0,
        createdAt: '2026-05-19T11:20:00',
        detectionLabel: '에어컨 공회전',
        thumbnailUrl:
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=200',
        aiResult: {
            result: 'WASTE_DETECTED',
            message: '빈 강의실에서 에어컨이 가동 중입니다.',
            ac_status: 'ON',
            light_status: 'ON',
        },
    },
    {
        reportId: 40,
        roomName: '학생회관 101호',
        buildingName: '학생회관',
        status: 'UNDETECTABLE',
        pointAwarded: 0,
        createdAt: '2026-05-18T09:15:00',
        detectionLabel: '판별 불가',
        aiResult: {
            result: 'ERROR',
            message: '강의실로 인식되지 않습니다.',
        },
    },
    {
        reportId: 39,
        roomName: '본관 501호',
        buildingName: '본관',
        status: 'APPROVED',
        pointAwarded: 50,
        createdAt: '2026-05-17T16:45:00',
        detectionLabel: '정상 상태',
        aiResult: {
            result: 'PASS',
            message: '강의실에 사람이 있습니다. 정상 상태입니다.',
        },
    },
    {
        reportId: 38,
        roomName: '공학관 A동 304호',
        buildingName: '공학관 A동',
        status: 'APPROVED',
        pointAwarded: 75,
        createdAt: '2026-05-16T13:30:00',
        detectionLabel: '조명 켜짐 감지',
        thumbnailUrl:
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200',
    },
]

export function getMockReports(
    page = 0,
    size = 20,
    status?: ReportStatus | 'ALL',
): PaginatedReports {
    const filtered =
        !status || status === 'ALL'
            ? MOCK_REPORTS_RAW
            : MOCK_REPORTS_RAW.filter((r) => r.status === status)

    const start = page * size
    const content = filtered
        .slice(start, start + size)
        .map(({ aiResult, ...rest }) => rest)

    return {
        content,
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / size)),
        page,
        size,
    }
}

export function getMockReportDetail(
    reportId: number,
): ReportDetail | undefined {
    return MOCK_REPORTS_RAW.find((r) => r.reportId === reportId)
}

export const MOCK_ADMIN_REPORTS: AdminReportRow[] = [
    {
        reportId: 42,
        buildingName: '공학관 A동',
        roomName: '303호',
        memberName: '김에코',
        status: 'PENDING',
        aiResult: '조명 ON / AC OFF',
        pointAwarded: 89,
        createdAt: '2026-05-20T14:03:22',
    },
    {
        reportId: 41,
        buildingName: '도서관',
        roomName: '2열람실',
        memberName: '이민준',
        status: 'APPROVED',
        aiResult: 'AC ON / 조명 ON',
        pointAwarded: 120,
        createdAt: '2026-05-19T11:20:00',
    },
    {
        reportId: 40,
        buildingName: '학생회관',
        roomName: '101호',
        memberName: '박그린',
        status: 'REJECTED',
        aiResult: '판별 불가',
        pointAwarded: 0,
        createdAt: '2026-05-18T09:15:00',
    },
]

export const MOCK_ADMIN_DASHBOARD: AdminDashboardStats = {
    todayReports: 24,
    pendingReports: 5,
    totalCo2SavedKg: 1240,
    monthlyReports: 156,
    monthlySavingsKrw: 320000,
}

let mockPointsState = { ...MOCK_POINTS }

export function getMockPoints(): PointsSummary {
    return { ...mockPointsState }
}

export function updateMockPointsAfterExchange(
    pointUsed: number,
): PointsSummary {
    mockPointsState = {
        ...mockPointsState,
        currentBalance: mockPointsState.currentBalance - pointUsed,
        totalRedeemed: mockPointsState.totalRedeemed + pointUsed,
    }
    return getMockPoints()
}

export function updateMockPointsAfterReport(
    pointAwarded: number,
): PointsSummary {
    mockPointsState = {
        ...mockPointsState,
        currentBalance: mockPointsState.currentBalance + pointAwarded,
        thisMonthEarned: mockPointsState.thisMonthEarned + pointAwarded,
        totalEarned: mockPointsState.totalEarned + pointAwarded,
    }
    return getMockPoints()
}
