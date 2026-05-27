import { useEffect, useState } from 'react'
import { getMyBuildingSavings } from 'src/globals/api/savingsApi'
import {
    PARTICIPATED_BUILDING_SAVINGS,
    type ParticipatedBuildingSavings,
} from './userSavingsData'

export function useMyBuildingSavings() {
    const [buildings, setBuildings] = useState<ParticipatedBuildingSavings[]>(
        [],
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        void getMyBuildingSavings()
            .then(setBuildings)
            .catch(() => setBuildings(PARTICIPATED_BUILDING_SAVINGS))
            .finally(() => setLoading(false))
    }, [])

    return { buildings, loading }
}
