import type {
    Building,
    BuildingLocation,
    LocationTreeNode,
} from 'src/globals/api/types'

export interface SelectableReportLocation extends BuildingLocation {
    buildingId: number
    buildingName: string
}

export function flattenAffiliationLeafLocations(
    buildings: Building[],
): SelectableReportLocation[] {
    const result: SelectableReportLocation[] = []

    for (const building of buildings) {
        for (const leaf of flattenLeafLocations(building.children, building.name)) {
            result.push({
                ...leaf,
                buildingId: building.buildingId,
                buildingName: building.name,
            })
        }
    }

    return result
}

export function flattenLeafLocations(
    nodes: LocationTreeNode[] | undefined,
    prefix = '',
): BuildingLocation[] {
    if (!nodes?.length) {
        return []
    }

    const result: BuildingLocation[] = []

    for (const node of nodes) {
        const path = prefix ? `${prefix} > ${node.name}` : node.name

        if (node.nodeKind === 'LEAF') {
            result.push({
                locationId: node.locationId,
                name: node.name,
                path,
            })
            continue
        }

        if (node.children?.length) {
            result.push(...flattenLeafLocations(node.children, path))
        }
    }

    return result
}
