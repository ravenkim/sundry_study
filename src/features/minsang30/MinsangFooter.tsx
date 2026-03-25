const footerLinks = [
    { href: '#', label: 'Instagram' },
    { href: '#', label: 'Direction' },
    { href: '#', label: 'Contact' },
] as const

const MinsangFooter = () => {
    return (
        <footer
            className="bg-m30-surface-container-lowest border-white/5 border-t py-10"
            style={{
                paddingLeft: 'max(1.5rem, env(safe-area-inset-left, 0px))',
                paddingRight: 'max(1.5rem, env(safe-area-inset-right, 0px))',
                paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))',
            }}
        >
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start md:gap-6">
                <div className="font-m30-headline text-center text-sm font-bold tracking-[0.35em] text-white uppercase sm:tracking-[0.5em]">
                    MINSANG — 30
                </div>
                <nav
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
                    aria-label="푸터 링크"
                >
                    {footerLinks.map(({ href, label }) => (
                        <a
                            key={label}
                            className="inline-flex min-h-11 min-w-[44px] items-center justify-center text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase transition-colors touch-manipulation [-webkit-tap-highlight-color:transparent] hover:text-white"
                            href={href}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
                <p className="text-center text-[9px] tracking-widest text-white/20 uppercase">
                    © 2024 THE MIDNIGHT KINETIC
                </p>
            </div>
        </footer>
    )
}

export default MinsangFooter
