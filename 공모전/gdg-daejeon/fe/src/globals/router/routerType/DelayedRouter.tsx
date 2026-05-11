import React, { useEffect, useState } from 'react'

interface DelayedSuspenseProps {
    children: React.ReactNode
    fallback: React.ReactNode
    delay?: number // LazyPage 로딩 시간 최소 임계값 (예: 1000ms)
    minFallback?: number // fallback 최소 표시 시간 (예: 500ms)
}

const DelayedRouter: React.FC<DelayedSuspenseProps> = ({
    children,
    fallback,
    delay = 1000,
    minFallback = 4000,
}) => {
    const [showFallback, setShowFallback] = useState(false)
    const [showChildren, setShowChildren] = useState(false)

    useEffect(() => {
        const delayTimer = setTimeout(() => {
            setShowFallback(true)
        }, delay)

        return () => clearTimeout(delayTimer)
    }, [delay])

    useEffect(() => {
        if (showFallback) {
            const minFallbackTimer = setTimeout(() => {
                setShowChildren(true)
            }, minFallback)
            return () => clearTimeout(minFallbackTimer)
        }
    }, [showFallback, minFallback])

    if (!showFallback) return null
    if (!showChildren) return fallback

    return <>{children}</>
}

export default DelayedRouter
