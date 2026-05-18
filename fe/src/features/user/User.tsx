import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
    Leaf,
    ArrowLeft,
    Plus,
    TrendingUp,
    CheckCircle2,
    ChevronRight,
    Coins,
    ClipboardCheck,
    Bell,
    FileText,
    Edit2,
    LogOut,
} from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'

export const UserHome = () => (
    <div className="p-5 flex flex-col gap-8 pb-24 md:pb-8">
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-black text-primary">EcoReport</h1>
            </div>
            <EcoBadge variant="yellow">1,250P</EcoBadge>
        </header>

        <div className="grid grid-cols-1 gap-4">
            <EcoCard className="flex flex-col gap-2">
                <span className="text-sm text-on-surface-variant font-medium">내 포인트</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">370</span>
                    <span className="text-2xl font-bold text-primary">P</span>
                </div>
                <span className="text-xs text-secondary font-medium">이번 달 +220 P</span>
            </EcoCard>

            <EcoCard className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                <span className="text-sm text-on-surface-variant font-medium">이번 달 캠퍼스 절약량</span>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-secondary">🌿 243 kWh</span>
                </div>
                <span className="text-xs text-on-surface-variant">🌲 소나무 12그루 흡수량과 동등</span>
                <div className="w-full bg-surface-container-high h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: '65%' }}></div>
                </div>
            </EcoCard>
        </div>

        <Link to="/report-form">
            <EcoButton className="w-full py-4 text-lg shadow-md">📷 낭비 제보하기</EcoButton>
        </Link>

        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">최근 제보 내역</h2>
            <div className="flex flex-col gap-1 bg-outline-variant rounded-xl overflow-hidden border border-outline-variant">
                {[
                    {
                        loc: '공학관 A동 303호',
                        type: '🟡 조명 켜짐 감지',
                        status: '승인됨',
                        pts: '+89P',
                    },
                    {
                        loc: '도서관 2열람실',
                        type: '💨 에어컨 공터 가동',
                        status: '검토중',
                        pts: '-',
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-surface-container-lowest p-4 flex justify-between items-center hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-bold">{item.loc}</span>
                            <div className="flex gap-2">
                                <EcoBadge>{item.type}</EcoBadge>
                                <EcoBadge variant={item.status === '승인됨' ? 'green' : 'gray'}>
                                    {item.status}
                                </EcoBadge>
                            </div>
                        </div>
                        <span
                            className={cn(
                                'font-bold',
                                item.pts.startsWith('+') ? 'text-secondary' : 'text-on-surface-variant',
                            )}
                        >
                            {item.pts}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex justify-center pb-4">
            <Link
                to="/admin"
                className="px-4 py-1.5 rounded-full bg-on-surface/10 text-on-surface-variant text-[10px] font-black opacity-40 hover:opacity-100 transition-all border border-outline-variant"
            >
                🛡️ Admin 대시보드 →
            </Link>
        </div>
    </div>
)

export const UserReportForm = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null)

    return (
        <div className="p-5 flex flex-col gap-8 max-w-lg mx-auto pb-24">
            <header className="flex items-center">
                <Link to="/" className="p-2 -ml-2 text-primary">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="flex-1 text-center font-black text-xl mr-8">제보하기</h1>
            </header>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">어디서 낭비되고 있나요?</h2>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant">건물 선택</label>
                    <select className="p-4 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none">
                        <option>건물을 선택해주세요</option>
                        <option>공학관 A동</option>
                        <option>도서관</option>
                        <option>학생회관</option>
                        <option>본관</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant">상세 장소</label>
                    <input
                        type="text"
                        placeholder="예: 303호, 2층 복도 우측"
                        className="p-4 border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary-container outline-none"
                    />
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">어떤 종류의 낭비인가요?</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { name: '조명 켜짐', icon: '💡', id: 'light' },
                        { name: '에어컨 공회전', icon: '❄️', id: 'ac' },
                        { name: '난방 과열', icon: '🔥', id: 'heat' },
                        { name: '기타', icon: '⚡', id: 'etc' },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedType(item.id)}
                            className={cn(
                                'border rounded-xl p-6 flex flex-col items-center gap-2 transition-colors cursor-pointer bg-surface',
                                selectedType === item.id
                                    ? 'border-primary bg-primary-container/10'
                                    : 'border-outline-variant hover:bg-surface-container-low',
                            )}
                        >
                            <span className="text-3xl">{item.icon}</span>
                            <span className="text-sm font-bold">{item.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">현장 사진을 첨부해주세요</h2>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center gap-2 bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low justify-center opacity-70">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                        <Plus className="w-6 h-6 text-on-surface-variant" />
                    </div>
                    <p className="text-sm text-center">
                        터치하여 낭비 현장을 촬영하세요
                        <br />
                        (선택 사항)
                    </p>
                </div>
            </section>

            <Link to="/report-success" className="mt-4">
                <EcoButton className="w-full py-4 text-lg">제보 완료</EcoButton>
            </Link>
        </div>
    )
}

export const UserReportSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center gap-8 bg-surface">
        <div className="p-8 rounded-full bg-secondary-container/20">
            <CheckCircle2 className="w-24 h-24 text-secondary" />
        </div>
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black">제보가 완료되었습니다!</h1>
            <p className="text-on-surface-variant">에너지 절약에 동참해주셔서 감사합니다.</p>
        </div>

        <EcoCard className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">예상 적립 포인트</span>
                <EcoBadge variant="yellow">리워드</EcoBadge>
            </div>
            <div className="text-right">
                <span className="text-4xl font-bold text-primary">+100P</span>
            </div>
        </EcoCard>

        <EcoCard className="w-full max-w-sm text-left flex flex-col gap-3 px-6 py-4">
            <h3 className="font-bold text-sm">제보 요약</h3>
            <div className="flex justify-between border-b border-surface-container pb-2">
                <span className="text-sm text-on-surface-variant">건물명</span>
                <span className="text-sm font-bold">공학관 A동</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">제보 유형</span>
                <span className="text-sm font-bold">불필요한 조명 켜짐</span>
            </div>
        </EcoCard>

        <div className="w-full max-w-sm flex flex-col gap-3">
            <Link to="/">
                <EcoButton className="w-full py-3">홈으로 이동</EcoButton>
            </Link>
            <Link to="/reports">
                <EcoButton variant="outline" className="w-full py-3">
                    제보 내역 확인하기
                </EcoButton>
            </Link>
        </div>
    </div>
)

export const UserPointShop = () => (
    <div className="p-5 flex flex-col gap-6 max-w-[390px] mx-auto pb-24">
        <header className="flex justify-between items-center pt-2">
            <h1 className="text-2xl font-black text-primary">포인트샵</h1>
            <EcoBadge variant="yellow">MY</EcoBadge>
        </header>

        <EcoCard className="bg-primary-container/10 border-primary-container p-5">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                내 포인트
            </span>
            <div className="flex items-baseline gap-1 mt-1">
                <span className="text-5xl font-black leading-none text-primary">1,250</span>
                <span className="text-2xl font-bold text-primary">P</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs text-secondary font-bold">이번 달 +220P 적립</span>
            </div>
        </EcoCard>

        <nav className="flex gap-4 overflow-x-auto no-scrollbar border-b border-outline-variant/30 pb-1 pt-2 -mx-5 px-5">
            {['전체', '커피/음료', '편의점', '환경 기부'].map((tab, i) => (
                <button
                    key={tab}
                    className={cn(
                        'pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all',
                        i === 0
                            ? 'border-primary text-on-surface'
                            : 'border-transparent text-on-surface-variant opacity-60',
                    )}
                >
                    {tab}
                </button>
            ))}
        </nav>

        <div className="grid grid-cols-2 gap-4">
            {[
                {
                    name: '스타벅스 아이스 아메리카노 T',
                    price: '4,500 P',
                    img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200',
                },
                {
                    name: 'GS25 모바일 상품권 5천원',
                    price: '5,000 P',
                    img: 'https://images.unsplash.com/photo-1542382257-80dee8dabc95?auto=format&fit=crop&q=80&w=200',
                },
                {
                    name: '지구온난화 방지 기금 기부',
                    price: '1,000 P ~',
                    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200',
                    tag: '기부',
                },
                {
                    name: '배스킨라빈스 싱글레귤러',
                    price: '3,900 P',
                    img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=200',
                },
            ].map((item, i) => (
                <article
                    key={i}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden flex flex-col hover:border-primary transition-all group cursor-pointer active:scale-95"
                >
                    <div className="aspect-square bg-surface-container-low relative overflow-hidden">
                        {item.tag && (
                            <EcoBadge
                                variant="green"
                                className="absolute top-2 left-2 z-10 px-2 py-0.5"
                            >
                                {item.tag}
                            </EcoBadge>
                        )}
                        <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="p-3.5 flex flex-col gap-1.5 flex-grow">
                        <h3 className="text-xs font-bold line-clamp-2 leading-snug text-on-surface">
                            {item.name}
                        </h3>
                        <div className="mt-auto">
                            <span className="text-sm font-black text-primary">{item.price}</span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </div>
)

export const UserProfile = () => (
    <div className="p-5 flex flex-col gap-8 max-w-[390px] mx-auto pb-24">
        <header className="flex justify-between items-center py-2 sticky top-0 bg-background/80 backdrop-blur-sm z-10 -mx-5 px-5">
            <span className="p-2 -ml-2 text-primary">
                <ClipboardCheck className="w-7 h-7" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-primary">마이페이지</h1>
            <EcoBadge variant="yellow" className="text-sm font-bold py-1 px-3">
                1,250P
            </EcoBadge>
        </header>

        <section className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-primary-container p-1 overflow-hidden shadow-sm">
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kim"
                    alt="User"
                    className="w-full h-full object-cover rounded-full bg-surface-container"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">김에코</h2>
                <EcoBadge variant="green" className="w-max px-3 py-1 text-xs flex items-center gap-1.5 font-bold">
                    <Leaf className="w-3.5 h-3.5 fill-current" /> 그린 마스터
                </EcoBadge>
            </div>
        </section>

        <EcoCard className="p-6 relative overflow-hidden hover:bg-surface-container-low cursor-pointer">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05]">
                <Coins className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    보유 포인트
                </span>
                <div className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                    내역 보기 <ChevronRight className="w-3 h-3" />
                </div>
            </div>
            <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-4xl font-black text-primary tracking-tight">1,250</span>
                <span className="text-xl font-bold text-primary">P</span>
            </div>
        </EcoCard>

        <section className="grid grid-cols-2 gap-4">
            <EcoCard className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                    <ClipboardCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">총 제보</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">15</span>
                    <span className="text-[10px] font-bold text-on-surface-variant">건</span>
                </div>
            </EcoCard>
            <EcoCard className="p-4 flex flex-col gap-3 border-l-4 border-l-secondary">
                <div className="flex items-center gap-2 text-secondary">
                    <Leaf className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">절감 효과</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">3.2</span>
                    <span className="text-[10px] font-bold text-on-surface-variant">kg</span>
                </div>
            </EcoCard>
        </section>

        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
            {[
                { icon: Edit2, label: '프로필 수정' },
                { icon: Bell, label: '알림 설정' },
                { icon: FileText, label: '서비스 이용약관' },
                { icon: LogOut, label: '로그아웃', color: 'text-error' },
            ].map((item) => (
                <div
                    key={item.label}
                    className={cn(
                        'flex items-center justify-between p-4 border-b border-surface-container last:border-0 hover:bg-surface-container-low transition-colors group cursor-pointer',
                        item.color,
                    )}
                >
                    <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                        <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
            ))}
        </section>
    </div>
)
