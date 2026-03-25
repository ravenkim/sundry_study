import sangPortrait from 'src/assets/pic/sang.png'

const MinsangHero = () => {
    return (
        <section
            className="border-white/5 relative flex min-h-[85vh] flex-col justify-center border-b pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-10 pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] md:min-h-[90vh] md:pb-16 md:pl-[max(6rem,env(safe-area-inset-left,0px))] md:pr-[max(6rem,env(safe-area-inset-right,0px))]"
        >
            <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-50"
                style={{
                    background:
                        'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
                }}
            />
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(220px,38%)] md:gap-x-10 md:gap-y-10">
                <div className="max-w-4xl md:col-start-1 md:row-start-1">
                    <h2 className="font-m30-headline mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-white/40 sm:tracking-[0.6em]">
                        EST. 1997 — 2026
                    </h2>
                    <h1 className="font-m30-headline mb-6 text-[clamp(2.75rem,14vw,6rem)] font-bold leading-[0.88] tracking-tighter text-white sm:text-[clamp(3.25rem,12vw,8rem)] md:mb-0 md:text-[12rem] md:leading-[0.85]">
                        MINSANG
                        <br />
                        <span className="text-white m30-neon-glow">
                            30 BIRTHDAY
                        </span>
                        <br />
                        <span className="text-white m30-neon-glow">PARTY</span>
                    </h1>
                </div>
                <div className="flex min-h-0 w-full min-w-0 items-end justify-center md:col-start-2 md:row-span-2 md:row-start-1 md:justify-end">
                    <img
                        alt="Minsang"
                        className="max-h-[min(52vh,520px)] w-auto max-w-full object-contain object-bottom select-none md:max-h-[min(76vh,760px)]"
                        decoding="async"
                        draggable={false}
                        fetchPriority="high"
                        loading="eager"
                        src={sangPortrait}
                    />
                </div>
                <div className="max-w-4xl md:col-start-1 md:row-start-2">
                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-6">
                        <p className="max-w-md text-base font-light leading-relaxed text-white/50 sm:text-lg md:text-xl">
                            Celebrating three decades of movement. <br />
                            A night of kinetic energy and deep rhythms.
                        </p>
                        <div className="border-white/10 flex flex-row gap-8 border-t pt-6 md:h-fit md:border-t-0 md:border-l md:pt-2 md:pl-6">
                            <div className="flex flex-col">
                                <span className="mb-1 text-[9px] font-bold uppercase tracking-widest text-white/30">
                                    DATE
                                </span>
                                <span className="font-m30-headline text-lg font-medium uppercase text-white">
                                    MAR 23
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="mb-1 text-[9px] font-bold uppercase tracking-widest text-white/30">
                                    START
                                </span>
                                <span className="font-m30-headline text-lg font-medium uppercase text-white">
                                    21:00
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MinsangHero
