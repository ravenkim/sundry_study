import heeackDj from 'src/assets/pic/heeack.png'
import {
    GoogleMapsIcon,
    KakaoMapIcon,
    NaverMapIcon,
} from 'src/features/minsang30/MapAppIcons.tsx'

/** 지도 앱 검색에 쓰는 동일한 주소 문자열 */
const VENUE_MAP_QUERY = '도림도 147길 22 서울'

const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_MAP_QUERY)}`
const NAVER_MAPS_URL = `https://map.naver.com/v5/search/${encodeURIComponent(VENUE_MAP_QUERY)}`
const KAKAO_MAPS_URL = `https://map.kakao.com/link/search/${encodeURIComponent(VENUE_MAP_QUERY)}`

const mapLinkClassName =
    'group border-white/20 hover:bg-white hover:text-black inline-flex min-h-11 flex-1 items-center justify-center gap-2.5 border px-4 py-3.5 text-center text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-all touch-manipulation sm:min-w-0 sm:gap-3 sm:px-6 sm:py-4 sm:tracking-[0.25em]'

const POPXICK_INSTAGRAM_URL =
    'https://www.instagram.com/popxick?igsh=MTd6eml1OTRiZWYyOQ=='

const sectionPad =
    'pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))]'

const MinsangEventGrid = () => {
    return (
        <section
            className="bg-m30-surface-container-low border-white/5 border-b"
            id="details"
        >
            <div className="border-white/5 grid grid-cols-1 border-l md:grid-cols-4">
                {/* DJ — double width */}
                <div
                    className={`group border-white/5 grid grid-cols-1 gap-8 border-r border-b py-8 md:col-span-2 md:grid-cols-[minmax(0,1fr)_minmax(200px,46%)] md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-8 ${sectionPad}`}
                >
                    <span className="w-fit bg-white px-2 py-1.5 text-[9px] font-black uppercase tracking-tighter text-black md:col-start-1 md:row-start-1 md:self-start">
                        special DJ
                    </span>
                    <div className="flex min-h-0 w-full min-w-0 items-end justify-center md:col-start-2 md:row-span-2 md:row-start-1 md:justify-end">
                        <img
                            alt="POPXICK"
                            className="max-h-[min(52vh,520px)] w-auto max-w-full object-contain object-bottom select-none transition-transform duration-300 group-hover:scale-[1.02] md:max-h-[min(64vh,600px)]"
                            decoding="async"
                            draggable={false}
                            loading="lazy"
                            src={heeackDj}
                        />
                    </div>
                    <div className="min-w-0 md:col-start-1 md:row-start-2 md:self-end">
                        <h3 className="font-m30-headline text-4xl font-bold tracking-tighter break-words text-white sm:text-5xl md:text-6xl">
                            POPXICK
                        </h3>
                        <a
                            className="mt-2 inline-block text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 italic underline-offset-2 transition-colors hover:text-white/70 hover:underline touch-manipulation"
                            href={POPXICK_INSTAGRAM_URL}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            @popxick
                        </a>
                    </div>
                </div>

                {/* Dress code */}
                <div
                    className={`border-white/5 flex min-h-56 flex-col justify-between gap-6 border-r border-b py-8 text-center md:min-h-80 md:text-left ${sectionPad}`}
                >
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">
                    DRESS CODE                           
                    </span>
                    <div className="space-y-2">
                        <p className="font-m30-headline text-xl font-bold text-white sm:text-2xl">
GL                                       </p>
                        <p className="text-[11px] leading-relaxed uppercase tracking-wider text-white/50">
                            잘생기고 이쁜 얼굴
                            <br />
                        </p>
                    </div>
                </div>

                {/* Drinks / Food */}
                <div className="border-white/5 flex flex-col border-r border-b">
                    <div
                        className={`border-white/5 flex-1 border-b py-8 ${sectionPad}`}
                    >
                        <span className="mb-4 block text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">
                            DRINKS
                        </span>
                        <p className="font-m30-headline text-xl font-bold text-white">
                            BYOB
                        </p>
                        <p className="mt-1 text-[10px] text-white/40">
                            마시고 싶은 술 따로 사오기 <br />
                            1인당 1소주 웰컴드링크 증정!
                        </p>
                    </div>
                    <div className={`flex-1 py-8 ${sectionPad}`}>
                        <span className="mb-4 block text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">
                            FOOD
                        </span>
                        <p className="font-m30-headline text-xl font-bold text-white">
                            FINGER FOODS
                        </p>
                        <p className="mt-1 text-[10px] text-white/40">
                            간단한 케이터링 제공
                        </p>
                    </div>
                </div>

                {/* Location */}
                <div
                    className={`bg-m30-surface-container-high border-white/5 flex flex-col justify-between gap-8 border-b py-8 md:col-span-4 md:flex-row md:items-center md:py-12 ${sectionPad}`}
                    id="location"
                >
                    <div className="flex min-w-0 items-start gap-4 sm:gap-6">
                        <div className="bg-white/10 shrink-0 p-3 sm:p-4">
                            <span
                                className="m30-material-symbol text-2xl text-white sm:text-3xl"
                                aria-hidden
                            >
                                location_on
                            </span>
                        </div>
                        <div className="min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">
                                VENUE
                            </span>
                            <h4 className="font-m30-headline mt-1 text-xl font-bold break-words uppercase tracking-tight text-white sm:text-2xl md:text-3xl">
                                도림도 147길 22, 4F
                            </h4>
                            <p className="mt-1 text-xs uppercase text-white/40">
                                Seoul, South Korea
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                        <a
                            className={mapLinkClassName}
                            href={GOOGLE_MAPS_URL}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <GoogleMapsIcon className="group-hover:drop-shadow-none" />
                            <span className="leading-tight">OPEN GOOGLE MAPS</span>
                        </a>
                        <a
                            className={mapLinkClassName}
                            href={NAVER_MAPS_URL}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <NaverMapIcon className="group-hover:drop-shadow-none" />
                            <span className="leading-tight">네이버 지도</span>
                        </a>
                        <a
                            className={mapLinkClassName}
                            href={KAKAO_MAPS_URL}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <KakaoMapIcon className="group-hover:drop-shadow-none" />
                            <span className="leading-tight">카카오맵</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MinsangEventGrid
