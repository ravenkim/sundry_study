import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import {
    Home,
    ClipboardCheck,
    ShoppingBag,
    User as UserIcon,
    Search,
    Bell,
    Settings,
    HelpCircle,
    LogOut,
    Database,
    BarChart3,
    Users,
    Menu,
    Camera,
    Shield,
} from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from 'src/shared/lib/shadcn/components/ui/sheet'
import { EcoBadge } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'
import SSdarkmodeSwitch from 'src/shared/components/theme/SSdarkmodeSwitch.tsx'
import { usePoints } from 'src/features/points/PointsContext'

export const USER_NAV_ITEMS = [
    { name: '홈', path: '/', icon: Home },
    { name: '낭비 제보', path: '/report-form', icon: Camera, highlight: true },
    { name: '제보 이력', path: '/reports', icon: ClipboardCheck },
    { name: '포인트샵', path: '/shop', icon: ShoppingBag },
    { name: '마이페이지', path: '/profile', icon: UserIcon },
] as const

type UserAppLayoutProps = {
    children: ReactNode
    /** 상단 헤더 중앙 제목 (미지정 시 EcoReport 로고) */
    title?: string
    headerRight?: ReactNode
    /** false면 우측 포인트 뱃지 숨김 */
    showPoints?: boolean
}

export const UserAppLayout = ({
    children,
    title,
    headerRight,
    showPoints = true,
}: UserAppLayoutProps) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const { points, loading: pointsLoading } = usePoints()

    const closeMenu = () => setMenuOpen(false)

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/95 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-[390px] items-center gap-2 px-4">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary hover:bg-surface-container-low transition-colors"
                        aria-label="메뉴 열기"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {title ? (
                        <h1 className="flex-1 truncate text-center text-lg font-black text-primary">
                            {title}
                        </h1>
                    ) : (
                        <Link
                            to="/"
                            className="flex flex-1 items-center justify-center gap-2"
                            onClick={closeMenu}
                        >
                            <MascotImage emotion="nomal" size="xs" decorative />
                            <span className="text-lg font-black text-primary">EcoReport</span>
                        </Link>
                    )}

                    <div className="flex justify-end">
                        {headerRight ??
                            (showPoints ? (
                                <EcoBadge variant="yellow" className="text-xs font-bold">
                                    {pointsLoading
                                        ? '...'
                                        : `${points.currentBalance.toLocaleString()}P`}
                                </EcoBadge>
                            ) : (
                                <span className="w-8" aria-hidden />
                            ))}
                    </div>
                </div>
            </header>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent
                    side="left"
                    className="flex h-full w-[min(100%,280px)] flex-col border-outline-variant p-0"
                >
                    <SheetHeader className="border-b border-outline-variant bg-surface-container-low p-5 text-left">
                        <div className="flex items-center gap-3 pr-8">
                            <MascotImage emotion="nomal" size="sm" decorative className="rounded-full" />
                            <div>
                                <SheetTitle className="text-left text-base font-black text-primary">
                                    EcoReport
                                </SheetTitle>
                                <p className="text-xs text-on-surface-variant">캠퍼스 에너지 절약</p>
                            </div>
                        </div>
                    </SheetHeader>

                    <nav className="flex flex-col gap-1 p-3">
                        {USER_NAV_ITEMS.map((item) => {
                            const isActive = location.pathname === item.path
                            const isHighlight = 'highlight' in item && item.highlight
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl px-4 py-3.5 font-semibold transition-colors',
                                        isActive
                                            ? 'bg-primary-container text-on-primary-container'
                                            : isHighlight
                                              ? 'bg-secondary-container/30 text-secondary hover:bg-secondary-container/50'
                                              : 'text-on-surface hover:bg-surface-container-low',
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="mt-auto border-t border-outline-variant p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between rounded-xl px-4 py-3">
                            <span className="text-sm font-semibold text-on-surface-variant">
                                다크 모드
                            </span>
                            <SSdarkmodeSwitch />
                        </div>
                        <Link
                            to="/admin"
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                        >
                            <Shield className="h-5 w-5" />
                            관리자 대시보드
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>

            <main className="mx-auto w-full max-w-[390px] flex-1">{children}</main>
        </div>
    )
}

export const AdminSidebar = () => {
    const location = useLocation()
    const navItems = [
        { name: '제보 현황', path: '/admin', icon: Database },
        { name: '제보 관리', path: '/admin/reports', icon: ClipboardCheck },
        { name: '건물·강의실', path: '/admin/buildings', icon: Settings },
        { name: '포인트 관리', path: '/admin/points', icon: ShoppingBag },
        { name: '에너지 통계', path: '/admin/stats', icon: BarChart3 },
        { name: '사용자 관리', path: '/admin/users', icon: Users },
    ]
    return (
        <aside className="w-64 border-r border-outline-variant h-screen fixed left-0 top-0 bg-surface-container-low p-4 flex flex-col gap-2 z-50">
            <div className="flex items-center gap-3 px-2 mb-8">
                <MascotImage emotion="nomal" size="sm" decorative />
                <div>
                    <h1 className="font-bold text-primary text-sm leading-tight">EcoReport Admin</h1>
                    <p className="text-[10px] text-on-surface-variant">Management Console</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive =
                        location.pathname === item.path ||
                        (item.path !== '/admin' && location.pathname.startsWith(item.path))
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all',
                                isActive
                                    ? 'bg-primary-container text-on-primary-container'
                                    : 'text-on-surface-variant hover:bg-surface-variant/50',
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </div>
            <div className="pt-4 border-t border-outline-variant flex flex-col gap-1">
                <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-semibold text-on-surface-variant">
                        다크 모드
                    </span>
                    <SSdarkmodeSwitch />
                </div>
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span>사용자 모드</span>
                </Link>
            </div>
        </aside>
    )
}

export const AdminHeader = ({ title }: { title: string }) => (
    <header className="h-16 border-b border-outline-variant sticky top-0 bg-surface px-8 flex items-center justify-between z-40">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                    type="text"
                    placeholder="검색..."
                    className="bg-surface-container-lowest border border-outline-variant rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-primary-container"
                />
            </div>
            <Bell className="w-5 h-5 text-on-surface-variant cursor-pointer" />
            <Settings className="w-5 h-5 text-on-surface-variant cursor-pointer" />
            <HelpCircle className="w-5 h-5 text-on-surface-variant cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
            </div>
        </div>
    </header>
)
