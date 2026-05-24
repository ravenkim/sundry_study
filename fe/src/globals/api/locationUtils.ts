import type { LocationTreeNode, BuildingLocation } from 'src/globals/api/types'

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
