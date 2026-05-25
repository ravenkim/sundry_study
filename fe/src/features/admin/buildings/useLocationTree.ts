import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import i18n from 'src/assets/locales/i18n'
import { getBuildings } from 'src/globals/api/buildingsApi'
import {
    createLocationNode,
    deleteLocationNode,
    getLocationNodeTree,
    updateLocationNode,
} from 'src/globals/api/locationNodesApi'
import type { AdminLocationNode, LocationLeafPayload, NodeKind } from 'src/globals/api/types'
import { toApiOperatingSchedules } from 'src/features/admin/buildings/operatingScheduleUtils'
import {
    getBuildingNodes,
    getBreadcrumb,
    getMiddleNodes,
    getRoomNodes,
    isThirdColumnActive,
    type LocationDepth,
} from 'src/features/admin/buildings/locationTreeUtils'

export type SheetState =
    | {
          mode: 'create'
          depth: LocationDepth
          parentId?: number
      }
    | {
          mode: 'edit'
          node: AdminLocationNode
      }
    | null

export type AdminAffiliation = {
    affiliationId: number
    name: string
}

export function useLocationTree() {
    const [affiliation, setAffiliation] = useState<AdminAffiliation | null>(null)
    const [tree, setTree] = useState<AdminLocationNode[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [selected, setSelected] = useState<{
        buildingId?: number
        middleId?: number
        roomId?: number
    }>({})
    const [sheet, setSheet] = useState<SheetState>(null)

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
            .then((nodes) => setTree(Array.isArray(nodes) ? nodes : []))
            .catch(() => toast.error(i18n.t('adminBuildings:toast.treeLoadFailed')))
            .finally(() => setLoading(false))
    }, [affiliationId])

    useEffect(() => {
        loadAffiliation()
    }, [loadAffiliation])

    useEffect(() => {
        loadTree()
    }, [loadTree])

    const buildings = useMemo(() => getBuildingNodes(tree), [tree])
    const middleNodes = useMemo(
        () => getMiddleNodes(tree, selected.buildingId),
        [tree, selected.buildingId],
    )
    const roomNodes = useMemo(
        () => getRoomNodes(tree, selected.middleId),
        [tree, selected.middleId],
    )
    const thirdColumnActive = useMemo(
        () => isThirdColumnActive(tree, selected.middleId),
        [tree, selected.middleId],
    )

    const selectBuilding = useCallback((buildingId: number) => {
        setSelected({ buildingId })
    }, [])

    const selectMiddle = useCallback((middleId: number) => {
        setSelected((prev) => ({
            buildingId: prev.buildingId,
            middleId,
        }))
    }, [])

    const selectRoom = useCallback((roomId: number) => {
        setSelected((prev) => ({ ...prev, roomId }))
    }, [])

    const openCreateSheet = useCallback(
        (depth: LocationDepth) => {
            if (depth === 2 && !selected.buildingId) {
                toast.error(i18n.t('adminBuildings:toast.selectParent'))
                return
            }
            if (depth === 3) {
                if (!selected.middleId) {
                    toast.error(i18n.t('adminBuildings:toast.selectGroup'))
                    return
                }
                const middle = getMiddleNodes(tree, selected.buildingId).find(
                    (n) => n.id === selected.middleId,
                )
                if (middle?.nodeKind !== 'GROUP') {
                    toast.error(i18n.t('adminBuildings:toast.selectGroupForLeaf'))
                    return
                }
            }

            setSheet({
                mode: 'create',
                depth,
                parentId:
                    depth === 1
                        ? undefined
                        : depth === 2
                          ? selected.buildingId
                          : selected.middleId,
            })
        },
        [selected.buildingId, selected.middleId, tree],
    )

    const openEditSheet = useCallback((node: AdminLocationNode) => {
        setSheet({ mode: 'edit', node })
    }, [])

    const closeSheet = useCallback(() => {
        setSheet(null)
    }, [])

    const pruneSelectionAfterDelete = useCallback(
        (deletedId: number) => {
            setSelected((prev) => {
                if (prev.roomId === deletedId) {
                    return {
                        buildingId: prev.buildingId,
                        middleId: prev.middleId,
                    }
                }
                if (prev.middleId === deletedId) {
                    return { buildingId: prev.buildingId }
                }
                if (prev.buildingId === deletedId) {
                    return {}
                }
                return prev
            })
        },
        [],
    )

    const handleCreate = useCallback(
        async (
            name: string,
            nodeKind: NodeKind,
            leafPayload?: LocationLeafPayload,
        ) => {
            if (!sheet || sheet.mode !== 'create' || !affiliationId) return false

            setSubmitting(true)
            try {
                const created = await createLocationNode({
                    parentId: sheet.parentId,
                    affiliationId,
                    name: name.trim(),
                    nodeKind,
                    ...(nodeKind === 'LEAF' && leafPayload
                        ? {
                              acCount: leafPayload.acCount,
                              fluorescentCount: leafPayload.fluorescentCount,
                              ledCount: leafPayload.ledCount,
                              operatingSchedules: toApiOperatingSchedules(
                                  leafPayload.operatingSchedules ?? [],
                              ),
                          }
                        : {}),
                })
                toast.success(i18n.t('adminBuildings:toast.createSuccess'))
                closeSheet()
                loadTree()

                if (sheet.depth === 1) {
                    setSelected({ buildingId: created.id })
                } else if (sheet.depth === 2) {
                    setSelected((prev) => ({
                        buildingId: prev.buildingId,
                        middleId: created.id,
                    }))
                }

                return true
            } catch {
                toast.error(i18n.t('adminBuildings:toast.createFailed'))
                return false
            } finally {
                setSubmitting(false)
            }
        },
        [affiliationId, closeSheet, loadTree, sheet],
    )

    const handleUpdate = useCallback(
        async (name: string, leafPayload?: LocationLeafPayload) => {
            if (!sheet || sheet.mode !== 'edit') return false
            if (!name.trim()) {
                toast.error(i18n.t('adminBuildings:toast.nameRequired'))
                return false
            }

            const nameUnchanged = name.trim() === sheet.node.name
            const resourcesUnchanged =
                sheet.node.nodeKind !== 'LEAF' ||
                !leafPayload ||
                (leafPayload.acCount === (sheet.node.acCount ?? 0) &&
                    leafPayload.fluorescentCount ===
                        (sheet.node.fluorescentCount ?? 0) &&
                    leafPayload.ledCount === (sheet.node.ledCount ?? 0))

            if (nameUnchanged && resourcesUnchanged && !leafPayload?.operatingSchedules) {
                closeSheet()
                return true
            }

            setSubmitting(true)
            try {
                await updateLocationNode(sheet.node.id, {
                    name: name.trim(),
                    ...(sheet.node.nodeKind === 'LEAF' && leafPayload
                        ? {
                              acCount: leafPayload.acCount,
                              fluorescentCount: leafPayload.fluorescentCount,
                              ledCount: leafPayload.ledCount,
                              operatingSchedules: toApiOperatingSchedules(
                                  leafPayload.operatingSchedules ?? [],
                              ),
                          }
                        : {}),
                })
                toast.success(i18n.t('adminBuildings:toast.updateSuccess'))
                closeSheet()
                loadTree()
                return true
            } catch {
                toast.error(i18n.t('adminBuildings:toast.updateFailed'))
                return false
            } finally {
                setSubmitting(false)
            }
        },
        [closeSheet, loadTree, sheet],
    )

    const handleDelete = useCallback(
        async (node: AdminLocationNode) => {
            setSubmitting(true)
            try {
                await deleteLocationNode(node.id)
                toast.success(i18n.t('adminBuildings:toast.deleteSuccess'))
                pruneSelectionAfterDelete(node.id)
                closeSheet()
                loadTree()
                return true
            } catch {
                toast.error(i18n.t('adminBuildings:toast.deleteFailed'))
                return false
            } finally {
                setSubmitting(false)
            }
        },
        [closeSheet, loadTree, pruneSelectionAfterDelete],
    )

    const sheetBreadcrumb = useMemo(() => {
        if (!sheet) return []
        if (sheet.mode === 'edit') {
            return getBreadcrumb(tree, sheet.node.id).slice(0, -1)
        }
        if (sheet.depth === 1) return []
        if (sheet.depth === 2 && selected.buildingId) {
            return getBreadcrumb(tree, selected.buildingId)
        }
        if (sheet.depth === 3 && selected.middleId) {
            return getBreadcrumb(tree, selected.middleId)
        }
        return []
    }, [selected.buildingId, selected.middleId, sheet, tree])

    return {
        affiliation,
        tree,
        loading,
        submitting,
        selected,
        sheet,
        sheetBreadcrumb,
        buildings,
        middleNodes,
        roomNodes,
        thirdColumnActive,
        selectBuilding,
        selectMiddle,
        selectRoom,
        openCreateSheet,
        openEditSheet,
        closeSheet,
        handleCreate,
        handleUpdate,
        handleDelete,
    }
}
