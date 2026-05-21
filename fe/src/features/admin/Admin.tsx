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
    Megaphone,
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
import { useAdminDashboardState, useAdminReportsState } from 'src/features/admin/useAdminData'
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
            <div className="md:ml-64 flex min-h-screen flex-col bg-surface-bright">
                <AdminHeader title="제보 현황" />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="mb-1 text-3xl font-bold">제보 관리</h2>
                            <p className="text-on-surface-variant">
                                캠퍼스 내 에너지 낭비 제보를 관리하고 승인하세요.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <EcoCard className="flex h-32 flex-col justify-between border-b-2 transition-all hover:border-primary-container">
                            <div className="flex justify-between">
                                <span className="text-sm font-bold text-on-surface-variant">오늘의 제보</span>
                                <div className="rounded-full bg-primary-container/20 p-1.5 text-primary">
                                    <ClipboardCheck className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">{stats?.todayReports ?? '—'}</span>
                                <span className="flex items-center text-xs font-bold text-secondary">
                                    <TrendingUp className="mr-1 h-3 w-3" /> 12% 증가
                                </span>
                            </div>
                        </EcoCard>
                        <EcoCard className="flex h-32 flex-col justify-between border-b-2 transition-all hover:border-error">
                            <div className="flex justify-between">
                                <span className="text-sm font-bold text-on-surface-variant">미처리 제보</span>
                                <div className="rounded-full bg-error-container p-1.5 text-error">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-error">
                                    {stats?.pendingReports ?? '—'}
                                </span>
                                <span className="text-xs text-on-surface-variant">신속 처리가 중요합니다</span>
                            </div>
                        </EcoCard>
                        <EcoCard className="flex h-32 flex-col justify-between border-b-2 transition-all hover:border-secondary">
                            <div className="flex justify-between">
                                <span className="text-sm font-bold text-on-surface-variant">누적 CO₂ 절감</span>
                                <div className="rounded-full bg-secondary-container p-1.5 text-secondary">
                                    <Leaf className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    {stats?.totalCo2SavedKg?.toLocaleString() ?? '—'}
                                </span>
                                <span className="text-xs text-on-surface-variant">kg</span>
                            </div>
                        </EcoCard>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface text-xs font-bold text-on-surface-variant">
                                    <th className="p-4">제보 일시</th>
                                    <th className="p-4">건물명</th>
                                    <th className="p-4">AI 판별</th>
                                    <th className="p-4">작성자</th>
                                    <th className="p-4">상태</th>
                                    <th className="p-4 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30 text-sm font-medium">
                                {reports.map((item) => (
                                    <tr
                                        key={item.reportId}
                                        className="transition-colors hover:bg-surface-container-low/30"
                                    >
                                        <td className="p-4 text-xs">
                                            {new Date(item.createdAt).toLocaleString('ko-KR')}
                                        </td>
                                        <td className="p-4">
                                            {item.buildingName} {item.roomName}
                                        </td>
                                        <td className="p-4">
                                            <EcoBadge variant="gray">{item.aiResult}</EcoBadge>
                                        </td>
                                        <td className="p-4">{item.memberName}</td>
                                        <td className="p-4">
                                            <EcoBadge
                                                variant={
                                                    item.status === 'PENDING'
                                                        ? 'yellow'
                                                        : item.status === 'APPROVED'
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
                                                <span className="font-bold text-secondary">
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
            <div className="md:ml-64 flex min-h-screen flex-col bg-surface-bright">
                <AdminHeader title="제보 관리" />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="mb-1 text-3xl font-black tracking-tight">제보 관리</h2>
                            <p className="text-sm font-medium text-on-surface-variant">
                                에너지 낭비 제보 내역을 확인하고 승인 여부를 결정합니다.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <EcoButton variant="outline" className="gap-2 px-4 py-2 text-xs font-bold">
                                <Download className="h-4 w-4" /> 내보내기
                            </EcoButton>
                        </div>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-lowest text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    <th className="px-6 py-4">제보 일시</th>
                                    <th className="px-6 py-4">건물/장소</th>
                                    <th className="px-6 py-4">AI 판별</th>
                                    <th className="px-6 py-4">작성자</th>
                                    <th className="px-6 py-4">상태</th>
                                    <th className="px-6 py-4 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30 text-sm font-medium">
                                {reports.map((item) => (
                                    <tr
                                        key={item.reportId}
                                        className="transition-colors hover:bg-surface-container-low/30"
                                    >
                                        <td className="px-6 py-4 text-xs font-bold text-on-surface-variant">
                                            {new Date(item.createdAt).toLocaleString('ko-KR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-on-surface">
                                                    {item.buildingName}
                                                </span>
                                                <span className="text-[10px] text-on-surface-variant">
                                                    {item.roomName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <EcoBadge variant="gray">{item.aiResult}</EcoBadge>
                                        </td>
                                        <td className="px-6 py-4 text-on-surface">{item.memberName}</td>
                                        <td className="px-6 py-4">
                                            <EcoBadge
                                                variant={
                                                    item.status === 'PENDING'
                                                        ? 'yellow'
                                                        : item.status === 'APPROVED'
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
                                                        className="rounded-lg bg-primary-container p-1.5 text-on-primary-container transition-all hover:brightness-95"
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
                                                        className="rounded-lg border border-outline-variant p-1.5 text-on-surface-variant transition-all hover:bg-surface-container-low"
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
                                                <span className="font-bold text-secondary">
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
            <div className="md:ml-64 flex flex-col min-h-screen bg-surface-bright">
                <AdminHeader title="에너지 통계" />
                <main className="p-8 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-1">통계 및 리포트</h1>
                            <p className="text-on-surface-variant font-medium text-sm">
                                에코리포트를 통한 캠퍼스 에너지 절약 성과 분석
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl bg-surface-container-lowest font-bold text-xs cursor-pointer hover:border-primary transition-all shadow-sm">
                            <Calendar className="w-4 h-4 text-on-surface-variant" />
                            <span>2024.10.01 - 2024.10.31</span>
                            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <EcoCard className="p-6 flex flex-col items-center">
                            <div className="w-full mb-6">
                                <h3 className="text-lg font-bold tracking-tight">건물별 제보 비중</h3>
                                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                                    가장 많이 제보된 건물 TOP 5
                                </p>
                            </div>
                            <div className="w-full h-56 relative flex items-center justify-center">
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
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-primary">1,240</span>
                                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                                        총 제보 수
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 w-full">
                                {pieData.map((d) => (
                                    <div key={d.name} className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ background: d.color }}
                                        />
                                        <span className="text-xs font-medium truncate text-on-surface-variant">
                                            {d.name}
                                        </span>
                                        <span className="text-xs font-bold ml-auto">{d.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </EcoCard>

                        <EcoCard className="lg:col-span-2 p-6 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold tracking-tight">절약 유형별 분포</h3>
                                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                                    주요 에너지 낭비 요소 해결 현황
                                </p>
                            </div>
                            <div className="flex-1 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            axisLine={false}
                                            tickLine={false}
                                            style={{ fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" fill="#FFC107" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </EcoCard>
                    </div>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="p-5 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                            <h3 className="font-bold text-lg">월별 데이터 요약</h3>
                            <EcoButton variant="outline" className="px-4 py-2 text-xs font-bold gap-2">
                                <Download className="w-4 h-4" /> 엑셀 다운로드
                            </EcoButton>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container-lowest text-on-surface-variant text-[10px] font-black uppercase tracking-widest border-b border-outline-variant">
                                        <th className="px-6 py-4">월</th>
                                        <th className="px-6 py-4">총 제보수</th>
                                        <th className="px-6 py-4">처리 완료</th>
                                        <th className="px-6 py-4">CO₂ 절감 추정치 (kg)</th>
                                        <th className="px-6 py-4 text-right">지급 포인트</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium divide-y divide-outline-variant/30">
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
                                            <td className="px-6 py-4 text-on-surface font-bold">
                                                {row.month}
                                            </td>
                                            <td className="px-6 py-4">{row.total}</td>
                                            <td className="px-6 py-4">
                                                <EcoBadge variant="green">{row.done}</EcoBadge>
                                            </td>
                                            <td className="px-6 py-4 text-secondary font-bold">
                                                {row.co2}kg
                                            </td>
                                            <td className="px-6 py-4 text-right text-primary font-bold">
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
        <div className="md:ml-64 flex flex-col min-h-screen bg-surface-bright">
            <AdminHeader title="사용자 관리" />
            <main className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight mb-1">가입자 목록</h2>
                        <p className="text-on-surface-variant font-medium text-sm">
                            캠퍼스 에너지 절약 캠페인에 동참 중인 전체 사용자 현황입니다.
                        </p>
                    </div>
                    <EcoButton className="px-5 py-2.5 text-sm font-bold gap-2">
                        <Megaphone className="w-4 h-4" /> 전체 공지 발송
                    </EcoButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: '전체 사용자', value: '1,450', icon: Users, color: 'text-primary' },
                        { label: '신규 가입 (주간)', value: '86', icon: UserIcon, color: 'text-secondary' },
                        { label: '활성 사용자 (일간)', value: '342', icon: Clock, color: 'text-tertiary' },
                        { label: '포인트 지급액', value: '2.4M', icon: Coins, color: 'text-primary' },
                    ].map((stat, i) => (
                        <EcoCard key={i} className="p-5 flex flex-col gap-4 relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center bg-surface-container',
                                        stat.color,
                                    )}
                                >
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    {stat.label}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-on-surface tracking-tight">
                                    {stat.value}
                                </span>
                                {stat.label.includes('가입') && (
                                    <span className="text-[10px] font-bold text-secondary ml-1">
                                        +12% ↑
                                    </span>
                                )}
                            </div>
                        </EcoCard>
                    ))}
                </div>

                <EcoCard className="overflow-hidden p-0">
                    <div className="p-4 bg-surface-container-low border-b border-outline-variant flex gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                type="text"
                                placeholder="사용자 이름, 이메일 검색..."
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-container font-medium"
                            />
                        </div>
                        <EcoButton variant="outline" className="px-4 py-2 text-sm font-bold">
                            필터링
                        </EcoButton>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-lowest text-on-surface-variant text-[10px] font-black uppercase tracking-widest border-b border-outline-variant">
                                <th className="px-6 py-4">사용자</th>
                                <th className="px-6 py-4">이메일</th>
                                <th className="px-6 py-4">가입일</th>
                                <th className="px-6 py-4">누적 제보</th>
                                <th className="px-6 py-4">보유 포인트</th>
                                <th className="px-6 py-4 text-right">액션</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium divide-y divide-outline-variant/30">
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
                                            <div className="w-9 h-9 rounded-full bg-surface-container overflow-hidden">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                    alt={user.name}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-on-surface">
                                                    {user.name}
                                                </span>
                                                <span className="text-[10px] text-secondary font-black leading-none">
                                                    {user.grade}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-on-surface-variant">{user.email}</td>
                                    <td className="px-6 py-4 text-on-surface-variant">{user.date}</td>
                                    <td className="px-6 py-4 font-bold">{user.count}건</td>
                                    <td className="px-6 py-4 text-primary font-black">{user.points}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all">
                                            <Settings className="w-4 h-4 text-on-surface-variant" />
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