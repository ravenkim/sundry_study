import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import { getMyPoints } from 'src/globals/api/pointsApi'
import type { PointsSummary } from 'src/globals/api/types'
import { MOCK_POINTS } from 'src/globals/api/mock/data'

interface PointsContextValue {
    points: PointsSummary
    loading: boolean
    refresh: () => Promise<void>
}

const PointsContext = createContext<PointsContextValue | null>(null)

export function PointsProvider({ children }: { children: ReactNode }) {
    const [points, setPoints] = useState<PointsSummary>(MOCK_POINTS)
    const [loading, setLoading] = useState(true)

    const refresh = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getMyPoints()
            setPoints(data)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void refresh()
    }, [refresh])

    const value = useMemo(
        () => ({ points, loading, refresh }),
        [points, loading, refresh],
    )

    return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>
}

export function usePoints(): PointsContextValue {
    const ctx = useContext(PointsContext)
    if (!ctx) throw new Error('usePoints must be used within PointsProvider')
    return ctx
}
