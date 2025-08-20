'use client'

import React, { ReactNode, useLayoutEffect, useRef } from 'react'

interface ResizableTextBoxProps {
    children: ReactNode
    className?: string
    maxFontSize?: number
}

const SSresizableTextBox = ({
    children,
    className = '',
    maxFontSize = 55, // todo 변경 필요
}: ResizableTextBoxProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLSpanElement>(null)

    useLayoutEffect(() => {
        const container = containerRef.current
        const text = textRef.current

        if (!container || !text) return

        const adjustFontSize = () => {
            const containerWidth = container.clientWidth
            const containerHeight = container.clientHeight

            const findOptimalSize = (low: number, high: number) => {
                let optimal = low
                while (low <= high) {
                    const mid = Math.floor((low + high) / 2)
                    if (mid === 0) return optimal

                    text.style.fontSize = `${mid}px`

                    if (
                        text.scrollWidth <= containerWidth &&
                        text.scrollHeight <= containerHeight
                    ) {
                        optimal = mid
                        low = mid + 1
                    } else {
                        high = mid - 1
                    }
                }
                return optimal
            }

            const optimalSize = findOptimalSize(1, maxFontSize)
            text.style.fontSize = `${optimalSize}px`
        }

        adjustFontSize()

        const observer = new ResizeObserver(adjustFontSize)
        observer.observe(container)

        return () => observer.disconnect()
    }, [children, maxFontSize])

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
            }}
        >
            <span ref={textRef} style={{ textAlign: 'center' }}>
                {children}
            </span>
        </div>
    )
}

export default SSresizableTextBox
