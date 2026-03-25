import { cn } from 'src/shared/lib/shadcn/lib/utils.ts'

type MapIconProps = {
    className?: string
}

const base =
    'size-[18px] shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] sm:size-5'

/** Google Maps 스타일 핀 */
export function GoogleMapsIcon({ className }: MapIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={cn(base, className)}
            aria-hidden
        >
            <path
                fill="#EA4335"
                d="M12 2C8.13 2 5 5.13 5 9c0 4.5 4.42 10.12 6.24 12.35a.9.9 0 0 0 1.52 0C14.58 19.12 19 13.5 19 9c0-3.87-3.13-7-7-7z"
            />
            <circle cx="12" cy="9" r="3.15" fill="#fff" />
            <circle cx="12" cy="9" r="1.55" fill="#4285F4" />
        </svg>
    )
}

/** 네이버 지도 — 브랜드 그린 + N 마크 */
export function NaverMapIcon({ className }: MapIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={cn(base, className)}
            aria-hidden
        >
            <rect width="24" height="24" fill="#03C75A" rx="5.5" />
            <path
                fill="none"
                stroke="#fff"
                strokeWidth="2.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.35 7.2v9.6M7.35 7.2l9.3 9.6M16.65 7.2v9.6"
            />
        </svg>
    )
}

/** 카카오맵 — 브랜드 옐로 + 위치 핀 */
export function KakaoMapIcon({ className }: MapIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={cn(base, className)}
            aria-hidden
        >
            <rect width="24" height="24" fill="#FEE500" rx="5.5" />
            <path
                fill="#191919"
                d="M12 6.35c-1.72 0-3.1 1.3-3.1 2.9 0 2.2 3.1 5.15 3.1 5.15s3.1-2.95 3.1-5.15c0-1.6-1.38-2.9-3.1-2.9zm0 3.85a.98.98 0 1 1 0-1.96.98.98 0 0 1 0 1.96z"
            />
        </svg>
    )
}
