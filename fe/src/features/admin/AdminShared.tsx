import { Coins } from 'lucide-react'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import { EcoBadge, EcoCard } from 'src/shared/ui/eco'

const MOCK_POINT_TRANSACTIONS = [
    {
        id: 1,
        member: '김에코',
        type: '적립',
        amount: '+89P',
        reason: '공학관 A동 303호 제보',
        date: '2026-05-20',
    },
    {
        id: 2,
        member: '이민준',
        type: '교환',
        amount: '-500P',
        reason: '스타벅스 아메리카노',
        date: '2026-05-19',
    },
    {
        id: 3,
        member: '박그린',
        type: '적립',
        amount: '+120P',
        reason: '도서관 2열람실 제보',
        date: '2026-05-18',
    },
]

export const AdminPoints = () => (
    <>
        <AdminSidebar />
        <div className="flex min-h-screen flex-col bg-surface-bright md:ml-64">
            <AdminHeader title="포인트 관리" />
            <main className="mx-auto w-full max-w-7xl p-8">
                <div className="mb-8">
                    <h2 className="mb-1 text-3xl font-bold">포인트 관리</h2>
                    <p className="text-sm text-on-surface-variant">
                        포인트 지급·교환 내역을 확인합니다.
                    </p>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-6">
                    {[
                        { label: '이번 달 지급', value: '12,450P' },
                        { label: '이번 달 교환', value: '8,200P' },
                        { label: '미정산', value: '4,250P' },
                    ].map((stat) => (
                        <EcoCard key={stat.label} className="flex flex-col gap-2 p-5">
                            <span className="text-xs font-bold text-on-surface-variant">
                                {stat.label}
                            </span>
                            <span className="text-2xl font-black text-primary">{stat.value}</span>
                        </EcoCard>
                    ))}
                </div>

                <EcoCard className="overflow-hidden p-0">
                    <div className="flex items-center gap-2 border-b border-outline-variant bg-surface-container-low p-4">
                        <Coins className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">포인트 거래 내역</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface text-xs font-bold text-on-surface-variant">
                                <th className="p-4">일시</th>
                                <th className="p-4">회원</th>
                                <th className="p-4">유형</th>
                                <th className="p-4">금액</th>
                                <th className="p-4">사유</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30 font-medium">
                            {MOCK_POINT_TRANSACTIONS.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="transition-colors hover:bg-surface-container-low/30"
                                >
                                    <td className="p-4">{tx.date}</td>
                                    <td className="p-4">{tx.member}</td>
                                    <td className="p-4">
                                        <EcoBadge variant={tx.type === '적립' ? 'green' : 'gray'}>
                                            {tx.type}
                                        </EcoBadge>
                                    </td>
                                    <td
                                        className={`p-4 font-bold ${tx.amount.startsWith('+') ? 'text-secondary' : 'text-error'}`}
                                    >
                                        {tx.amount}
                                    </td>
                                    <td className="p-4 text-on-surface-variant">{tx.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </EcoCard>
            </main>
        </div>
    </>
)
