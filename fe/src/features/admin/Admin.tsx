import {
    ClipboardCheck,
    TrendingUp,
    AlertCircle,
    Leaf,
    Search,
    Download,
    CheckCircle2,
    X,
    Settings,
    Coins,
    Users,
    User as UserIcon,
    Clock,
    ChevronDown,
    Calendar,
} from 'lucide-react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
} from 'recharts'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import {
    useAdminDashboardState,
    useAdminReportsState,
} from 'src/features/admin/useAdminData'
import type { ReportStatus } from 'src/globals/api/types'

const STATUS_LABEL: Record<ReportStatus, string> = {
    APPROVED: '처리완료',
    PENDING: '승인대기',
    REJECTED: '반려',
    UNDETECTABLE: '판별불가',
}
export const AdminDashboard = () => {
    const stats = useAdminDashboardState()
    const { reports, handleStatusUpdate } = useAdminReportsState()

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title="제보 현황" />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="mb-1 text-3xl font-bold">
                                제보 관리
                            </h2>
                            <p className="text-on-surface-variant">
                                캠퍼스 내 에너지 낭비 제보를 관리하고
                                승인하세요.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <EcoCard className="hover:border-primary-container flex h-32 flex-col justify-between border-b-2 transition-all">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant text-sm font-bold">
                                    오늘의 제보
                                </span>
                                <div className="bg-primary-container/20 text-primary rounded-full p-1.5">
                                    <ClipboardCheck className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    {stats?.todayReports ?? '—'}
                                </span>
                                <span className="text-secondary flex items-center text-xs font-bold">
                                    <TrendingUp className="mr-1 h-3 w-3" /> 12%
                                    증가
                                </span>
                            </div>
                        </EcoCard>
                        <EcoCard className="hover:border-error flex h-32 flex-col justify-between border-b-2 transition-all">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant text-sm font-bold">
                                    미처리 제보
                                </span>
                                <div className="bg-error-container text-error rounded-full p-1.5">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-error text-3xl font-bold">
                                    {stats?.pendingReports ?? '—'}
                                </span>
                                <span className="text-on-surface-variant text-xs">
                                    신속 처리가 중요합니다
                                </span>
                            </div>
                        </EcoCard>
                        <EcoCard className="hover:border-secondary flex h-32 flex-col justify-between border-b-2 transition-all">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant text-sm font-bold">
                                    누적 CO₂ 절감
                                </span>
                                <div className="bg-secondary-container text-secondary rounded-full p-1.5">
                                    <Leaf className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    {stats?.totalCo2SavedKg?.toLocaleString() ??
                                        '—'}
                                </span>
                                <span className="text-on-surface-variant text-xs">
                                    kg
                                </span>
                            </div>
                        </EcoCard>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-outline-variant bg-surface text-on-surface-variant border-b text-xs font-bold">
                                    <th className="p-4">제보 일시</th>
                                    <th className="p-4">건물명</th>
                                    <th className="p-4">AI 판별</th>
                                    <th className="p-4">작성자</th>
                                    <th className="p-4">상태</th>
                                    <th className="p-4 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                                {reports.map((item) => (
                                    <tr
                                        key={item.reportId}
                                        className="hover:bg-surface-container-low/30 transition-colors"
                                    >
                                        <td className="p-4 text-xs">
                                            {new Date(
                                                item.createdAt,
                                            ).toLocaleString('ko-KR')}
                                        </td>
                                        <td className="p-4">
                                            {item.buildingName} {item.roomName}
                                        </td>
                                        <td className="p-4">
                                            <EcoBadge variant="gray">
                                                {item.aiResult}
                                            </EcoBadge>
                                        </td>
                                        <td className="p-4">
                                            {item.memberName}
                                        </td>
                                        <td className="p-4">
                                            <EcoBadge
                                                variant={
                                                    item.status === 'PENDING'
                                                        ? 'yellow'
                                                        : item.status ===
                                                            'APPROVED'
                                                          ? 'green'
                                                          : 'gray'
                                                }
                                            >
                                                {STATUS_LABEL[item.status]}
                                            </EcoBadge>
                                        </td>
                                        <td className="p-4 text-right">
                                            {item.status === 'PENDING' ? (
                                                <div className="flex justify-end gap-2">
                                                    <EcoButton
                                                        className="px-3 py-1 text-xs"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'APPROVED',
                                                            )
                                                        }
                                                    >
                                                        승인
                                                    </EcoButton>
                                                    <EcoButton
                                                        variant="outline"
                                                        className="px-3 py-1 text-xs"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'REJECTED',
                                                            )
                                                        }
                                                    >
                                                        반려
                                                    </EcoButton>
                                                </div>
                                            ) : (
                                                <span className="text-secondary font-bold">
                                                    {item.pointAwarded > 0
                                                        ? `+${item.pointAwarded}P`
                                                        : '-'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </EcoCard>
                </main>
            </div>
        </>
    )
}

export const AdminReports = () => {
    const { reports, handleStatusUpdate } = useAdminReportsState()

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title="제보 관리" />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="mb-1 text-3xl font-black tracking-tight">
                                제보 관리
                            </h2>
                            <p className="text-on-surface-variant text-sm font-medium">
                                에너지 낭비 제보 내역을 확인하고 승인 여부를
                                결정합니다.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <EcoButton
                                variant="outline"
                                className="gap-2 px-4 py-2 text-xs font-bold"
                            >
                                <Download className="h-4 w-4" /> 내보내기
                            </EcoButton>
                        </div>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-outline-variant bg-surface-container-lowest text-on-surface-variant border-b text-[10px] font-black tracking-widest uppercase">
                                    <th className="px-6 py-4">제보 일시</th>
                                    <th className="px-6 py-4">건물/장소</th>
                                    <th className="px-6 py-4">AI 판별</th>
                                    <th className="px-6 py-4">작성자</th>
                                    <th className="px-6 py-4">상태</th>
                                    <th className="px-6 py-4 text-right">
                                        관리
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                                {reports.map((item) => (
                                    <tr
                                        key={item.reportId}
                                        className="hover:bg-surface-container-low/30 transition-colors"
                                    >
                                        <td className="text-on-surface-variant px-6 py-4 text-xs font-bold">
                                            {new Date(
                                                item.createdAt,
                                            ).toLocaleString('ko-KR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-on-surface font-bold">
                                                    {item.buildingName}
                                                </span>
                                                <span className="text-on-surface-variant text-[10px]">
                                                    {item.roomName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <EcoBadge variant="gray">
                                                {item.aiResult}
                                            </EcoBadge>
                                        </td>
                                        <td className="text-on-surface px-6 py-4">
                                            {item.memberName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <EcoBadge
                                                variant={
                                                    item.status === 'PENDING'
                                                        ? 'yellow'
                                                        : item.status ===
                                                            'APPROVED'
                                                          ? 'green'
                                                          : 'gray'
                                                }
                                            >
                                                {STATUS_LABEL[item.status]}
                                            </EcoBadge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'PENDING' ? (
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        className="bg-primary-container text-on-primary-container rounded-lg p-1.5 transition-all hover:brightness-95"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'APPROVED',
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-lg border p-1.5 transition-all"
                                                        onClick={() =>
                                                            void handleStatusUpdate(
                                                                item.reportId,
                                                                'REJECTED',
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-secondary font-bold">
                                                    {item.pointAwarded > 0
                                                        ? `+${item.pointAwarded}P`
                                                        : '-'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </EcoCard>
                </main>
            </div>
        </>
    )
}

export const AdminStats = () => {
    const pieData = [
        { name: '공학관 A동', value: 35, color: '#FFC107' },
        { name: '본관', value: 25, color: '#4CAF50' },
        { name: '학생회관', value: 20, color: '#00DFFC' },
        { name: '중앙도서관', value: 12, color: '#FFDDB3' },
        { name: '기타', value: 8, color: '#E5E2E1' },
    ]

    const barData = [
        { name: '조명 소등', value: 450 },
        { name: '냉난방 차단', value: 320 },
        { name: '대기전력 절감', value: 210 },
        { name: '창문 닫기', value: 150 },
        { name: '기타 절약', value: 110 },
    ]

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title="에너지 통계" />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-8">
                    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="mb-1 text-3xl font-black tracking-tight">
                                통계 및 리포트
                            </h1>
                            <p className="text-on-surface-variant text-sm font-medium">
                                에코리포트를 통한 캠퍼스 에너지 절약 성과 분석
                            </p>
                        </div>
                        <div className="border-outline-variant bg-surface-container-lowest hover:border-primary flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold shadow-sm transition-all">
                            <Calendar className="text-on-surface-variant h-4 w-4" />
                            <span>2024.10.01 - 2024.10.31</span>
                            <ChevronDown className="text-on-surface-variant h-4 w-4" />
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <EcoCard className="flex flex-col items-center p-6">
                            <div className="mb-6 w-full">
                                <h3 className="text-lg font-bold tracking-tight">
                                    건물별 제보 비중
                                </h3>
                                <p className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">
                                    가장 많이 제보된 건물 TOP 5
                                </p>
                            </div>
                            <div className="relative flex h-56 w-full items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pointer-events-none absolute flex flex-col items-center justify-center">
                                    <span className="text-primary text-3xl font-black">
                                        1,240
                                    </span>
                                    <span className="text-on-surface-variant text-[10px] font-bold uppercase">
                                        총 제보 수
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 grid w-full grid-cols-2 gap-x-6 gap-y-2">
                                {pieData.map((d) => (
                                    <div
                                        key={d.name}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                            style={{ background: d.color }}
                                        />
                                        <span className="text-on-surface-variant truncate text-xs font-medium">
                                            {d.name}
                                        </span>
                                        <span className="ml-auto text-xs font-bold">
                                            {d.value}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </EcoCard>

                        <EcoCard className="flex flex-col p-6 lg:col-span-2">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold tracking-tight">
                                    절약 유형별 분포
                                </h3>
                                <p className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">
                                    주요 에너지 낭비 요소 해결 현황
                                </p>
                            </div>
                            <div className="min-h-[300px] flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={barData}
                                        layout="vertical"
                                        margin={{ left: 20 }}
                                    >
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            axisLine={false}
                                            tickLine={false}
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#FFC107"
                                            radius={[0, 4, 4, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </EcoCard>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="bg-surface-container-low border-outline-variant flex items-center justify-between border-b p-5">
                            <h3 className="text-lg font-bold">
                                월별 데이터 요약
                            </h3>
                            <EcoButton
                                variant="outline"
                                className="gap-2 px-4 py-2 text-xs font-bold"
                            >
                                <Download className="h-4 w-4" /> 엑셀 다운로드
                            </EcoButton>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container-lowest text-on-surface-variant border-outline-variant border-b text-[10px] font-black tracking-widest uppercase">
                                        <th className="px-6 py-4">월</th>
                                        <th className="px-6 py-4">총 제보수</th>
                                        <th className="px-6 py-4">처리 완료</th>
                                        <th className="px-6 py-4">
                                            CO₂ 절감 추정치 (kg)
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            지급 포인트
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                                    {[
                                        {
                                            month: '2024년 10월',
                                            total: '1,240',
                                            done: '1,150 (92%)',
                                            co2: '3,450',
                                            pts: '115,000 P',
                                        },
                                        {
                                            month: '2024년 09월',
                                            total: '980',
                                            done: '950 (96%)',
                                            co2: '2,800',
                                            pts: '95,000 P',
                                        },
                                        {
                                            month: '2024년 08월',
                                            total: '1,450',
                                            done: '1,400 (96%)',
                                            co2: '4,120',
                                            pts: '140,000 P',
                                        },
                                    ].map((row) => (
                                        <tr
                                            key={row.month}
                                            className="hover:bg-surface-container-low transition-colors"
                                        >
                                            <td className="text-on-surface px-6 py-4 font-bold">
                                                {row.month}
                                            </td>
                                            <td className="px-6 py-4">
                                                {row.total}
                                            </td>
                                            <td className="px-6 py-4">
                                                <EcoBadge variant="green">
                                                    {row.done}
                                                </EcoBadge>
                                            </td>
                                            <td className="text-secondary px-6 py-4 font-bold">
                                                {row.co2}kg
                                            </td>
                                            <td className="text-primary px-6 py-4 text-right font-bold">
                                                {row.pts}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </EcoCard>
                </main>
            </div>
        </>
    )
}

export const AdminUsers = () => (
    <>
        <AdminSidebar />
        <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
            <AdminHeader title="사용자 관리" />
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                <div>
                    <h2 className="mb-1 text-3xl font-black tracking-tight">
                        가입자 목록
                    </h2>
                    <p className="text-on-surface-variant text-sm font-medium">
                        캠퍼스 에너지 절약 캠페인에 동참 중인 전체 사용자
                        현황입니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {[
                        {
                            label: '전체 사용자',
                            value: '1,450',
                            icon: Users,
                            color: 'text-primary',
                        },
                        {
                            label: '신규 가입 (주간)',
                            value: '86',
                            icon: UserIcon,
                            color: 'text-secondary',
                        },
                        {
                            label: '활성 사용자 (일간)',
                            value: '342',
                            icon: Clock,
                            color: 'text-tertiary',
                        },
                        {
                            label: '포인트 지급액',
                            value: '2.4M',
                            icon: Coins,
                            color: 'text-primary',
                        },
                    ].map((stat, i) => (
                        <EcoCard
                            key={i}
                            className="relative flex flex-col gap-4 overflow-hidden p-5"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        'bg-surface-container flex h-10 w-10 items-center justify-center rounded-full',
                                        stat.color,
                                    )}
                                >
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <span className="text-on-surface-variant text-[10px] font-black tracking-widest uppercase">
                                    {stat.label}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-on-surface text-3xl font-black tracking-tight">
                                    {stat.value}
                                </span>
                                {stat.label.includes('가입') && (
                                    <span className="text-secondary ml-1 text-[10px] font-bold">
                                        +12% ↑
                                    </span>
                                )}
                            </div>
                        </EcoCard>
                    ))}
                </div>

                <EcoCard className="overflow-hidden p-0">
                    <div className="bg-surface-container-low border-outline-variant flex gap-3 border-b p-4">
                        <div className="relative flex-1">
                            <Search className="text-on-surface-variant absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="사용자 이름, 이메일 검색..."
                                className="bg-surface-container-lowest border-outline-variant focus:border-primary-container w-full rounded-lg border py-2 pr-4 pl-10 text-sm font-medium focus:outline-none"
                            />
                        </div>
                        <EcoButton
                            variant="outline"
                            className="px-4 py-2 text-sm font-bold"
                        >
                            필터링
                        </EcoButton>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-lowest text-on-surface-variant border-outline-variant border-b text-[10px] font-black tracking-widest uppercase">
                                <th className="px-6 py-4">사용자</th>
                                <th className="px-6 py-4">이메일</th>
                                <th className="px-6 py-4">가입일</th>
                                <th className="px-6 py-4">누적 제보</th>
                                <th className="px-6 py-4">보유 포인트</th>
                                <th className="px-6 py-4 text-right">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-outline-variant/30 divide-y text-sm font-medium">
                            {[
                                {
                                    name: '김철수',
                                    email: 'chulsoo@univ.ac.kr',
                                    date: '2024.10.15',
                                    count: '12',
                                    points: '12,450 P',
                                    grade: '그린 마스터',
                                },
                                {
                                    name: '이영희',
                                    email: 'younghee@univ.ac.kr',
                                    date: '2024.10.20',
                                    count: '5',
                                    points: '4,200 P',
                                    grade: '그린 루키',
                                },
                                {
                                    name: '박지민',
                                    email: 'jimin@univ.ac.kr',
                                    date: '2024.10.22',
                                    count: '18',
                                    points: '24,600 P',
                                    grade: '에코 히어로',
                                },
                            ].map((user, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-surface-container-low/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-surface-container h-9 w-9 overflow-hidden rounded-full">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                    alt={user.name}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-on-surface font-bold">
                                                    {user.name}
                                                </span>
                                                <span className="text-secondary text-[10px] leading-none font-black">
                                                    {user.grade}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-on-surface-variant px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="text-on-surface-variant px-6 py-4">
                                        {user.date}
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {user.count}건
                                    </td>
                                    <td className="text-primary px-6 py-4 font-black">
                                        {user.points}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="border-outline-variant hover:bg-surface-container-low rounded-lg border p-2 transition-all">
                                            <Settings className="text-on-surface-variant h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </EcoCard>
            </main>
        </div>
    </>
)
