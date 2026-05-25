import type { AdminLocationNode } from 'src/globals/api/types'
import {
    normalizeOperatingSchedules,
    type OperatingScheduleItem,
} from 'src/features/admin/buildings/operatingScheduleUtils'

export const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 7] as const

export type ScheduleMatrixRow = {
    leafId: number
    leafName: string
    path: string[]
    pathLabel: string
    buildingId: number
    buildingName: string
    /** depth-2 ancestor id (direct child of building), or leaf id when LEAF at depth 2 */
    middleId: number
    middleName: string
    schedules: OperatingScheduleItem[]
}

export function getJavaDayOfWeek(date = new Date()): number {
    const jsDay = date.getDay()
    return jsDay === 0 ? 7 : jsDay
}

export function formatTimeShort(time?: string): string {
    if (!time) return ''
    return time.slice(0, 5)
}

export function formatScheduleCell(schedule: OperatingScheduleItem): {
    label: string
    variant: 'closed' | 'open'
} {
    if (schedule.closed) {
        return { label: '—', variant: 'closed' }
    }
    const on = formatTimeShort(schedule.powerOnTime)
    const off = formatTimeShort(schedule.powerOffTime)
    if (!on && !off) {
        return { label: '—', variant: 'closed' }
    }
    return {
        label: `${on || '?'}–${off || '?'}`,
        variant: 'open',
    }
}

export function collectScheduleMatrixRows(
    tree: AdminLocationNode[],
): ScheduleMatrixRow[] {
    const rows: ScheduleMatrixRow[] = []

    function walk(
        nodes: AdminLocationNode[],
        trail: string[],
        buildingId: number | null,
        buildingName: string | null,
        middleId: number | null,
        middleName: string | null,
    ) {
        for (const node of nodes) {
            const nextTrail = [...trail, node.name]
            const rootBuildingId = trail.length === 0 ? node.id : buildingId!
            const rootBuildingName = trail.length === 0 ? node.name : buildingName!
            const depth2Id = trail.length === 1 ? node.id : middleId
            const depth2Name = trail.length === 1 ? node.name : middleName

            if (node.nodeKind === 'LEAF') {
                rows.push({
                    leafId: node.id,
                    leafName: node.name,
                    path: nextTrail,
                    pathLabel: nextTrail.join(' › '),
                    buildingId: rootBuildingId,
                    buildingName: rootBuildingName,
                    middleId: depth2Id ?? node.id,
                    middleName: depth2Name ?? node.name,
                    schedules: normalizeOperatingSchedules(node.operatingSchedules),
                })
                continue
            }

            walk(
                node.children ?? [],
                nextTrail,
                rootBuildingId,
                rootBuildingName,
                depth2Id,
                depth2Name,
            )
        }
    }

    walk(tree, [], null, null, null, null)

    return rows.sort((a, b) => {
        const buildingCompare = a.buildingName.localeCompare(b.buildingName, 'ko')
        if (buildingCompare !== 0) return buildingCompare
        return a.pathLabel.localeCompare(b.pathLabel, 'ko')
    })
}

export function getBuildingFilterOptions(
    rows: ScheduleMatrixRow[],
): { id: number; name: string }[] {
    const map = new Map<number, string>()
    for (const row of rows) {
        map.set(row.buildingId, row.buildingName)
    }
    return [...map.entries()]
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}
