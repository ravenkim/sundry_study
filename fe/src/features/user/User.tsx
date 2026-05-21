import { useState } from 'react'
import { Link } from 'react-router'
import {
    Leaf,
    TrendingUp,
    ChevronRight,
    ClipboardCheck,
    Bell,
    FileText,
    Edit2,
    LogOut,
} from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton, EcoBadge, EcoCard } from 'src/shared/ui/eco'
import {
    MascotHero,
    MascotImage,
    MascotBubble,
    MascotWatermark,
} from 'src/shared/components/mascort'
import type { MascortEmotion } from 'src/shared/components/mascort'
import { ParticipatedBuildingSavingsCard } from './ParticipatedBuildingSavings'
import { formatKwh, PARTICIPATED_BUILDING_SAVINGS, sumParticipatedKwh } from './userSavingsData'

const REPORT_STATUS_MASCOT: Record<string, MascortEmotion> = {
    '승인됨': 'smile',
    '검토중': 'sleepy',
    '반려': 'sad',
}

export const UserHome = () => (
    <div className="p-5 flex flex-col gap-8 pb-8 md:pb-8">
        <MascotHero
            emotion="smile"
            title="오늘도 캠퍼스 에너지를 지켜요"
            subtitle="빈 강의실 낭비를 제보하고 포인트를 받아보세요"
        />

        <div className="grid grid-cols-1 gap-4">
            <EcoCard className="relative flex flex-col gap-2 overflow-hidden">
                <MascotWatermark emotion="smile" className="right-2 bottom-2" />
                <span className="text-sm text-on-surface-variant font-medium">내 포인트</span>
                <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-4xl font-bold text-primary">370</span>
                    <span className="text-2xl font-bold text-primary">P</span>
                </div>
                <span className="text-xs text-secondary font-medium">이번 달 +220 P</span>
            </EcoCard>

            <ParticipatedBuildingSavingsCard />
        </div>

        <Link to="/report-form">
            <EcoButton className="w-full py-4 text-lg shadow-md gap-3">
                <MascotImage emotion="recognize" size="xs" decorative />
                낭비 제보하기
            </EcoButton>
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
                        className="bg-surface-container-lowest p-4 flex justify-between items-center gap-3 hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                        <MascotImage
                            emotion={REPORT_STATUS_MASCOT[item.status] ?? 'nomal'}
                            size="xs"
                            decorative
                        />
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <span className="font-bold truncate">{item.loc}</span>
                            <div className="flex gap-2 flex-wrap">
                                <EcoBadge>{item.type}</EcoBadge>
                                <EcoBadge variant={item.status === '승인됨' ? 'green' : 'gray'}>
                                    {item.status}
                                </EcoBadge>
                            </div>
                        </div>
                        <span
                            className={cn(
                                'font-bold shrink-0',
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
                Admin 대시보드 →
            </Link>
        </div>
    </div>
)

export const UserReportForm = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null)

    return (
        <div className="p-5 flex flex-col gap-8 pb-8">
            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold flex-1">어디서 낭비되고 있나요?</h2>
                    <MascotImage emotion="question" size="sm" decorative />
                </div>
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
                        { name: '기타', icon: '⚡', id: 'etc', mascot: 'contempt' as const },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedType(item.id)}
                            className={cn(
                                'relative border rounded-xl p-6 flex flex-col items-center gap-2 transition-colors cursor-pointer bg-surface',
                                selectedType === item.id
                                    ? 'border-primary bg-primary-container/10'
                                    : 'border-outline-variant hover:bg-surface-container-low',
                            )}
                        >
                            {selectedType === item.id && (
                                <MascotImage
                                    emotion={item.id === 'etc' ? 'contempt' : 'recognize'}
                                    size="xs"
                                    decorative
                                    className="absolute top-2 right-2"
                                />
                            )}
                            <span className="text-3xl">{item.icon}</span>
                            <span className="text-sm font-bold">{item.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">현장 사진을 첨부해주세요</h2>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center gap-3 bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low justify-center">
                    <MascotImage emotion="recognize" size="md" decorative />
                    <p className="text-sm text-center text-on-surface-variant">
                        터치하여 낭비 현장을 촬영하세요
                        <br />
                        (선택 사항)
                    </p>
                </div>
            </section>

            <MascotBubble emotion="nomal">제보하면 포인트가 쌓여요!</MascotBubble>

            <Link to="/report-success" className="mt-2">
                <EcoButton className="w-full py-4 text-lg">제보 완료</EcoButton>
            </Link>
        </div>
    )
}

export const UserReportSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-3.5rem)] p-5 py-10 text-center gap-8 bg-surface">
        <MascotImage
            emotion="smile"
            size="hero"
            decorative
            className="animate-[mascot-pop_0.6s_ease-out_1]"
            imgClassName="max-h-40"
        />
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black">제보가 완료되었습니다!</h1>
            <p className="text-on-surface-variant">에너지 절약에 동참해주셔서 감사합니다.</p>
        </div>

        <EcoCard className="w-full max-w-sm flex flex-col gap-4 relative overflow-hidden">
            <MascotWatermark emotion="smile" className="right-0 bottom-0 opacity-[0.08]" />
            <div className="flex justify-between items-center text-sm relative z-10">
                <span className="text-on-surface-variant">예상 적립 포인트</span>
                <EcoBadge variant="yellow">리워드</EcoBadge>
            </div>
            <div className="text-right relative z-10">
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
    <div className="p-5 flex flex-col gap-6 pb-8">
        <EcoCard className="relative bg-primary-container/10 border-primary-container p-5 overflow-hidden">
            <MascotWatermark emotion="smile" className="right-3 bottom-3 opacity-20" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider relative z-10">
                내 포인트
            </span>
            <div className="flex items-baseline gap-1 mt-1 relative z-10">
                <span className="text-5xl font-black leading-none text-primary">1,250</span>
                <span className="text-2xl font-bold text-primary">P</span>
            </div>
            <div className="flex items-center gap-2 mt-2 relative z-10">
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
    <div className="p-5 flex flex-col gap-8 pb-8">
        <section className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-primary-container p-1 flex items-center justify-center bg-primary-container/20 shadow-sm overflow-hidden">
                <MascotImage emotion="nomal" size="lg" decorative className="h-16 w-16" />
            </div>
            <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">김에코</h2>
                <EcoBadge variant="green" className="w-max px-3 py-1 text-xs flex items-center gap-1.5 font-bold">
                    <Leaf className="w-3.5 h-3.5 fill-current" /> 그린 마스터
                </EcoBadge>
            </div>
        </section>

        <EcoCard className="p-6 relative overflow-hidden hover:bg-surface-container-low cursor-pointer">
            <MascotWatermark emotion="smile" className="right-0 bottom-0 opacity-[0.15]" />
            <div className="flex justify-between items-center mb-2 relative z-10">
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
                    <span className="text-[10px] font-bold uppercase tracking-wider">절약 전기</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                        {formatKwh(sumParticipatedKwh(PARTICIPATED_BUILDING_SAVINGS, 'total'))}
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant">kWh</span>
                </div>
                <span className="text-[10px] text-on-surface-variant">
                    참여 {PARTICIPATED_BUILDING_SAVINGS.length}개 건물 누적
                </span>
            </EcoCard>
        </section>

        <ParticipatedBuildingSavingsCard compact />

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
