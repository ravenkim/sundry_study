import React, { useEffect } from 'react'
import { ScrollArea } from 'src/shared/lib/shadcn/components/ui/scroll-area.tsx'

interface SSmobileProps {
    header?: React.ReactNode
    footer?: React.ReactNode
    children: React.ReactNode
}

/**
 * 모바일 환경에 특화된 공통 레이아웃 컴포넌트
 * - 상단 헤더, 하단 네비게이션(푸터), 중앙 컨텐츠 영역
 * - 안전 영역(padding, notch 등) 고려
 * - TailwindCSS 적용
 */
const HEADER_HEIGHT = 57
const FOOTER_HEIGHT = 68

const SSmobileLayout: React.FC<SSmobileProps> = ({
    header,
    footer,
    children,
}) => {
    const height = header ? HEADER_HEIGHT + FOOTER_HEIGHT : FOOTER_HEIGHT //todo  > 높이 자동으로 계산하게 변경 필요

    useEffect(() => {
        const preventGesture = (e: TouchEvent) => {
            // 좌우 스와이프(터치 이동)일 때만 막기
            if (e.touches && e.touches.length === 1) {
                e.preventDefault()
            }
        }
        document.body.addEventListener('touchmove', preventGesture, {
            passive: false,
        })
        return () => {
            document.body.removeEventListener('touchmove', preventGesture)
        }
    }, [])

    return (
        <div className="bg-background text-foreground border-border relative mx-auto flex min-h-[100dvh] max-w-md flex-col overflow-hidden border shadow-lg">
            {/* 상단 헤더 */}
            {header && (
                <header className="bg-background/90 border-border sticky top-0 z-10 border-b px-4 backdrop-blur">
                    {header}
                </header>
            )}
            {/* 중앙 컨텐츠 */}
            <ScrollArea
                className={`w-full`}
                style={{ height: `calc(100dvh - ${height + 5}px) ` }}
            >
                {children as React.ReactNode}
            </ScrollArea>
            {/* 하단 네비게이션/푸터 */}
            <footer className="bg-background/90 border-border sticky bottom-0 z-10 border-t backdrop-blur">
                {footer}
            </footer>
        </div>
    )
}

export default SSmobileLayout
