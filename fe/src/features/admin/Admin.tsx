import {
    ClipboardCheck,
    TrendingUp,
    AlertCircle,
    Leaf,
    Search,
    Download,
    Plus,
    CheckCircle2,
    X,
    Edit2,
    Settings,
    Megaphone,
    Coins,
    Users,
    User as UserIcon,
    Clock,
    ChevronRight,
    ChevronLeft,
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

export const AdminDashboard = () => (
    <>
        <AdminSidebar />
        <div className="md:ml-64 flex flex-col min-h-screen bg-surface-bright">
            <AdminHeader title="제보 현황" />
            <main className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold mb-1">제보 관리</h2>
                        <p className="text-on-surface-variant">
                            캠퍼스 내 에너지 낭비 제보를 관리하고 승인하세요.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <EcoCard className="flex flex-col justify-between h-32 border-b-2 hover:border-primary-container transition-all">
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-on-surface-variant">오늘의 제보</span>
                            <div className="p-1.5 rounded-full bg-primary-container/20 text-primary">
                                <ClipboardCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">24</span>
                            <span className="text-secondary text-xs flex items-center font-bold">
                                <TrendingUp className="w-3 h-3 mr-1" /> 12% 증가
                            </span>
                        </div>
                    </EcoCard>
                    <EcoCard className="flex flex-col justify-between h-32 border-b-2 hover:border-error transition-all">
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-on-surface-variant">미처리 제보</span>
                            <div className="p-1.5 rounded-full bg-error-container text-error">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-error">5</span>
                            <span className="text-on-surface-variant text-xs">신속 처리가 중요합니다</span>
                        </div>
                    </EcoCard>
                    <EcoCard className="flex flex-col justify-between h-32 border-b-2 hover:border-secondary transition-all">
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-on-surface-variant">누적 CO₂ 절감</span>
                            <div className="p-1.5 rounded-full bg-secondary-container text-secondary">
                                <Leaf className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">1,240</span>
                            <span className="text-on-surface-variant text-xs">kg</span>
                        </div>
                    </EcoCard>
                </div>

                <EcoCard className="overflow-hidden p-0">
                    <div className="p-4 bg-surface-container-low border-b border-outline-variant flex gap-4">
                        <select className="border border-outline-variant rounded-lg px-3 py-1.5 text-sm bg-surface outline-none">
                            <option>전체 건물</option>
                            <option>본관 (A동)</option>
                        </select>
                        <select className="border border-outline-variant rounded-lg px-3 py-1.5 text-sm bg-surface outline-none">
                            <option>전체 상태</option>
                            <option>승인대기</option>
                            <option>처리완료</option>
                        </select>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface text-on-surface-variant text-xs font-bold border-b border-outline-variant">
                                <th className="p-4">제보 일시</th>
                                <th className="p-4">건물명</th>
                                <th className="p-4">제보 내용</th>
                                <th className="p-4">작성자</th>
                                <th className="p-4">상태</th>
                                <th className="p-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium divide-y divide-outline-variant/30">
                            {[
                                {
                                    time: '14:30',
                                    loc: '공학관 A동',
                                    msg: '빈 강의실 조명 8개 점등 상태',
                                    user: '김철수',
                                    status: '승인대기',
                                },
                                {
                                    time: '11:15',
                                    loc: '학생회관',
                                    msg: '창문 개방 상태로 에어컨 풀가동',
                                    user: '이영희',
                                    status: '처리완료',
                                },
                                {
                                    time: '09:45',
                                    loc: '별관 (B동)',
                                    msg: '2층 남자 화장실 누수',
                                    user: '박사원',
                                    status: '승인대기',
                                },
                            ].map((item, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-surface-container-low/30 transition-colors"
                                >
                                    <td className="p-4">{item.time}</td>
                                    <td className="p-4">{item.loc}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <EcoBadge variant="gray">조명</EcoBadge>
                                            <span className="truncate max-w-xs">{item.msg}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">{item.user}</td>
                                    <td className="p-4">
                                        <EcoBadge
                                            variant={item.status === '승인대기' ? 'yellow' : 'green'}
                                        >
                                            {item.status}
                                        </EcoBadge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            {item.status === '승인대기' ? (
                                                <>
                                                    <EcoButton className="px-3 py-1 text-xs">
                                                        승인
                                                    </EcoButton>
                                                    <EcoButton
                                                        variant="outline"
                                                        className="px-3 py-1 text-xs"
                                                    >
                                                        반려
                                                    </EcoButton>
                                                </>
                                            ) : (
                                                <span className="text-secondary font-bold">+500P</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 text-center text-xs text-on-surface-variant border-t border-outline-variant">
                        총 124건 중 1-3건
                    </div>
                </EcoCard>
            </main>
        </div>
    </>
)

export const AdminReports = () => (
    <>
        <AdminSidebar />
        <div className="md:ml-64 flex flex-col min-h-screen bg-surface-bright">
            <AdminHeader title="제보 현황" />
            <main className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight mb-1">제보 관리</h2>
                        <p className="text-on-surface-variant font-medium text-sm">
                            에너지 낭비 제보 내역을 확인하고 승인 여부를 결정합니다.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <EcoButton variant="outline" className="px-4 py-2 text-xs font-bold gap-2">
                            <Download className="w-4 h-4" /> 내보내기
                        </EcoButton>
                        <EcoButton className="px-4 py-2 text-xs font-bold gap-2">
                            <Plus className="w-4 h-4" /> 일괄 승인
                        </EcoButton>
                    </div>
                </div>

                <EcoCard className="overflow-hidden p-0">
                    <div className="p-4 bg-surface-container-low border-b border-outline-variant flex gap-3 overflow-x-auto no-scrollbar">
                        <select className="border border-outline-variant rounded-lg px-3 py-1.5 text-xs bg-surface outline-none font-bold text-on-surface-variant">
                            <option>전체 건물</option>
                            <option>공학관 A동</option>
                            <option>학생회관</option>
                        </select>
                        <select className="border border-outline-variant rounded-lg px-3 py-1.5 text-xs bg-surface outline-none font-bold text-on-surface-variant">
                            <option>전체 상태</option>
                            <option>승인대기</option>
                            <option>처리완료</option>
                            <option>반려</option>
                        </select>
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                type="text"
                                placeholder="제보 내용 검색..."
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-primary-container font-medium"
                            />
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-lowest text-on-surface-variant text-[10px] font-black uppercase tracking-widest border-b border-outline-variant">
                                <th className="px-6 py-4">제보 일시</th>
                                <th className="px-6 py-4">건물/장소</th>
                                <th className="px-6 py-4">제보 내용</th>
                                <th className="px-6 py-4">작성자</th>
                                <th className="px-6 py-4">상태</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium divide-y divide-outline-variant/30">
                            {[
                                {
                                    time: '2024-10-31 14:30',
                                    loc: '공학관 A동',
                                    subLoc: '303호 강의실',
                                    msg: '빈 강의실 조명 8개 점등 상태',
                                    user: '김철수',
                                    status: '승인대기',
                                    type: '조명',
                                },
                                {
                                    time: '2024-10-31 11:15',
                                    loc: '학생회관',
                                    subLoc: '2층 복도',
                                    msg: '창문 개방 상태로 에어컨 풀가동',
                                    user: '이영희',
                                    status: '처리완료',
                                    type: '냉난방',
                                },
                                {
                                    time: '2024-10-30 18:45',
                                    loc: '본관 A동',
                                    subLoc: '1층 로비',
                                    msg: '사용하지 않는 안내 전광판 켜짐',
                                    user: '박지민',
                                    status: '승인대기',
                                    type: '기타',
                                },
                                {
                                    time: '2024-10-30 15:20',
                                    loc: '중앙도서관',
                                    subLoc: '3층 열람실',
                                    msg: '화장실 세면대 물 지속 방류',
                                    user: '최동욱',
                                    status: '반려',
                                    type: '수자원',
                                },
                            ].map((item, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-surface-container-low/30 transition-colors"
                                >
                                    <td className="px-6 py-4 text-xs font-bold text-on-surface-variant">
                                        {item.time}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-on-surface">{item.loc}</span>
                                            <span className="text-[10px] text-on-surface-variant">
                                                {item.subLoc}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <EcoBadge
                                                variant={
                                                    item.type === '조명'
                                                        ? 'yellow'
                                                        : item.type === '냉난방'
                                                          ? 'green'
                                                          : 'gray'
                                                }
                                            >
                                                {item.type}
                                            </EcoBadge>
                                            <span className="truncate max-w-[200px] font-bold">
                                                {item.msg}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-on-surface">{item.user}</td>
                                    <td className="px-6 py-4">
                                        <EcoBadge
                                            variant={
                                                item.status === '승인대기'
                                                    ? 'yellow'
                                                    : item.status === '처리완료'
                                                      ? 'green'
                                                      : 'red'
                                            }
                                        >
                                            {item.status}
                                        </EcoBadge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {item.status === '승인대기' ? (
                                            <div className="flex gap-1 justify-end">
                                                <button className="p-1.5 rounded-lg bg-primary-container text-on-primary-container hover:brightness-95 transition-all">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                            페이지 1 / 15
                        </span>
                        <div className="flex gap-1">
                            <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-low opacity-50">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="p-1 bg-primary-container text-on-primary-container font-bold text-[10px] w-6 h-6 flex items-center justify-center rounded">
                                1
                            </button>
                            <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-low font-bold text-[10px] w-6 h-6 flex items-center justify-center">
                                2
                            </button>
                            <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-low font-bold text-[10px] w-6 h-6 flex items-center justify-center">
                                3
                            </button>
                            <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-low">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </EcoCard>
            </main>
        </div>
    </>
)

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

export const AdminPoints = () => (
    <>
        <AdminSidebar />
        <div className="md:ml-64 flex flex-col min-h-screen bg-surface-bright">
            <AdminHeader title="포인트 관리" />
            <main className="p-8">
                <div className="mt-8 text-center flex flex-col items-center gap-4 opacity-60">
                    <Coins className="w-16 h-16 text-on-surface-variant" />
                    <h3 className="text-xl font-bold">포인트 지급/차감 시스템</h3>
                    <p className="text-on-surface-variant text-sm">준비 중입니다.</p>
                </div>
            </main>
        </div>
    </>
)
