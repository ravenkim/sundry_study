import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import i18n from 'src/assets/locales/i18n'
import { getBuildings } from 'src/globals/api/buildingsApi'
import {
    getLocationNodeTree,
    updateLocationNode,
} from 'src/globals/api/locationNodesApi'
import type { AdminLocationNode } from 'src/globals/api/types'
import {
    normalizeOperatingSchedules,
    toApiOperatingSchedules,
    type OperatingScheduleItem,
} from 'src/features/admin/buildings/operatingScheduleUtils'
import { getMiddleNodes } from 'src/features/admin/buildings/locationTreeUtils'
import {
    collectScheduleMatrixRows,
    getBuildingFilterOptions,
    type ScheduleMatrixRow,
} from 'src/features/admin/schedules/scheduleMatrixUtils'

export type AdminAffiliation = {
    affiliationId: number
    name: string
}

export type ScheduleEditTarget = ScheduleMatrixRow | null

export function useScheduleMatrix() {
    const [affiliation, setAffiliation] = useState<AdminAffiliation | null>(null)
    const [tree, setTree] = useState<AdminLocationNode[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [buildingFilter, setBuildingFilterState] = useState<number | 'all'>('all')
    const [middleFilter, setMiddleFilter] = useState<number | 'all'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    const setBuildingFilter = useCallback((value: number | 'all') => {
        setBuildingFilterState(value)
        setMiddleFilter('all')
    }, [])
    const [editTarget, setEditTarget] = useState<ScheduleEditTarget>(null)

    const loadAffiliation = useCallback(() => {
        void getBuildings()
            .then((buildings) => {
                const list = Array.isArray(buildings) ? buildings : []
                const scoped = list.find((b) => b.affiliationId != null)
                if (scoped?.affiliationId) {
                    setAffiliation({
                        affiliationId: scoped.affiliationId,
                        name:
                            scoped.affiliationName ??
                            i18n.t('adminBuildings:affiliationFallback'),
                    })
                    return
                }
                setAffiliation(null)
            })
            .catch(() =>
                toast.error(i18n.t('adminBuildings:toast.affiliationLoadFailed')),
            )
    }, [])

    const affiliationId = affiliation?.affiliationId ?? null

    const loadTree = useCallback(() => {
        if (!affiliationId) {
            setTree([])
            setLoading(false)
            return
        }

        setLoading(true)
        void getLocationNodeTree(affiliationId)
            .then(setTree)
            .catch(() => {
                toast.error(i18n.t('adminBuildings:toast.treeLoadFailed'))
                setTree([])
            })
            .finally(() => setLoading(false))
    }, [affiliationId])

    useEffect(() => {
        loadAffiliation()
    }, [loadAffiliation])

    useEffect(() => {
        loadTree()
    }, [loadTree])

    const allRows = useMemo(() => collectScheduleMatrixRows(tree), [tree])

    const buildingOptions = useMemo(
        () => getBuildingFilterOptions(allRows),
        [allRows],
    )

    const middleOptions = useMemo(() => {
        if (buildingFilter === 'all') return []
        return getMiddleNodes(tree, buildingFilter).map((node) => ({
            id: node.id,
            name: node.name,
        }))
    }, [tree, buildingFilter])

    const filteredRows = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return allRows.filter((row) => {
            if (buildingFilter !== 'all' && row.buildingId !== buildingFilter) {
                return false
            }
            if (middleFilter !== 'all' && row.middleId !== middleFilter) {
                return false
            }
            if (!query) return true
            return (
                row.leafName.toLowerCase().includes(query) ||
                row.pathLabel.toLowerCase().includes(query) ||
                row.buildingName.toLowerCase().includes(query) ||
                row.middleName.toLowerCase().includes(query)
            )
        })
    }, [allRows, buildingFilter, middleFilter, searchQuery])

    const saveSchedules = useCallback(
        async (row: ScheduleMatrixRow, schedules: OperatingScheduleItem[]) => {
            setSubmitting(true)
            try {
                await updateLocationNode(row.leafId, {
                    name: row.leafName,
                    operatingSchedules: toApiOperatingSchedules(schedules),
                })
                toast.success(i18n.t('adminSchedules:toast.updateSuccess'))
                setEditTarget(null)
                loadTree()
            } catch {
                toast.error(i18n.t('adminSchedules:toast.updateFailed'))
            } finally {
                setSubmitting(false)
            }
        },
        [loadTree],
    )

    const openEdit = useCallback((row: ScheduleMatrixRow) => {
        setEditTarget({
            ...row,
            schedules: normalizeOperatingSchedules(row.schedules),
        })
    }, [])

    return {
        affiliation,
        loading,
        submitting,
        allRows,
        filteredRows,
        buildingFilter,
        setBuildingFilter,
        middleFilter,
        setMiddleFilter,
        buildingOptions,
        middleOptions,
        searchQuery,
        setSearchQuery,
        editTarget,
        setEditTarget,
        openEdit,
        saveSchedules,
        reload: loadTree,
    }
}
