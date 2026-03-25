type MinsangRsvpProps = {
    onConfirm?: () => void
}

const MinsangRsvp = ({ onConfirm }: MinsangRsvpProps) => {
    return (
        <section
            className="bg-m30-surface relative flex flex-col items-center justify-center overflow-hidden py-16 text-center sm:py-24"
            id="rsvp"
            style={{
                paddingLeft: 'max(1.5rem, env(safe-area-inset-left, 0px))',
                paddingRight: 'max(1.5rem, env(safe-area-inset-right, 0px))',
            }}
        >
            <div
                className="pointer-events-none absolute -bottom-10 left-1/2 max-w-[100vw] -translate-x-1/2 select-none overflow-hidden text-[clamp(6rem,42vw,20rem)] font-black leading-none text-white/[0.02] whitespace-nowrap sm:-bottom-20"
                aria-hidden
            >
                RSVP RSVP RSVP
            </div>
            <div className="relative z-10 w-full max-w-xl space-y-6 sm:space-y-8">
                <h2 className="font-m30-headline text-[clamp(2.25rem,10vw,6rem)] font-bold uppercase leading-[1.05] tracking-tighter text-white italic sm:text-6xl md:text-8xl">
                    ARE YOU IN?
                </h2>
                <p className="text-sm font-light uppercase tracking-widest text-white/40 sm:text-base md:text-lg">
                    Limited capacity — Confirm attendance
                </p>
                <button
                    className="w-full min-h-12 touch-manipulation bg-white px-10 py-4 text-xs font-black tracking-[0.35em] text-black uppercase transition-all duration-300 [-webkit-tap-highlight-color:transparent] hover:bg-white/90 active:scale-[0.98] sm:min-h-14 sm:px-16 sm:py-6 sm:tracking-[0.4em] md:w-auto"
                    type="button"
                    onClick={onConfirm}
                >
                    CONFIRM RSVP
                </button>
            </div>
        </section>
    )
}

export default MinsangRsvp
