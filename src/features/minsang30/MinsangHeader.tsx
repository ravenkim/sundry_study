import { useState } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from 'src/shared/lib/shadcn/components/ui/sheet.tsx'
import { cn } from 'src/shared/lib/shadcn/lib/utils.ts'

const nav = [
    { href: '#details', label: 'DETAILS' },
    { href: '#location', label: 'LOCATION' },
    { href: '#rsvp', label: 'RSVP' },
] as const

const MinsangHeader = () => {
    const [open, setOpen] = useState(false)

    return (
        <header
            className={cn(
                'border-white/5 bg-m30-surface/90 fixed top-0 z-40 w-full border-b backdrop-blur-md',
                'pt-[env(safe-area-inset-top,0px)]',
                'pl-[max(1rem,env(safe-area-inset-left,0px))]',
                'pr-[max(1rem,env(safe-area-inset-right,0px))]',
            )}
        >
            <div className="flex h-14 items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className="m30-material-symbol text-white md:hidden flex size-11 shrink-0 items-center justify-center rounded-sm touch-manipulation [-webkit-tap-highlight-color:transparent]"
                                aria-expanded={open}
                                aria-controls="minsang-mobile-nav"
                                aria-label="메뉴 열기"
                            >
                                menu
                            </button>
                        </SheetTrigger>
                       
                    </Sheet>
                    <span
                        className="m30-material-symbol hidden text-white md:inline"
                        aria-hidden
                    >
                        menu
                    </span>
                    <span className="font-m30-headline truncate text-sm font-bold tracking-[0.3em] text-white">
                        MINSANG 30
                    </span>
                </div>
                <nav className="hidden items-center gap-6 font-['Inter'] text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 md:flex">
                    {nav.map(({ href, label }) => (
                        <a
                            key={href}
                            className="rounded-sm px-1 py-2 transition-colors hover:text-white"
                            href={href}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    )
}

export default MinsangHeader
