import { useEffect, useMemo, useState } from 'react'
import { useAuth } from 'src/features/auth/AuthContext'
import { getMyBuildingSavings } from 'src/globals/api/savingsApi'
import {
    PARTICIPATED_BUILDING_SAVINGS,
    type ParticipatedBuildingSavings,
} from './userSavingsData'

export function useMyBuildingSavings() {
    const { user } = useAuth()
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

    const scopedBuildings = useMemo(() => {
        if (!user?.buildingId && !user?.buildingName) {
            return buildings
        }
        return buildings.filter(
            (building) =>
                (user.buildingId != null &&
                    String(building.buildingId) === String(user.buildingId)) ||
                building.buildingName === user.buildingName,
        )
    }, [buildings, user?.buildingId, user?.buildingName])

    return { buildings: scopedBuildings, loading }
}
