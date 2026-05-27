import i18n from 'src/assets/locales/i18n'
import type { AdminLocationNode, NodeKind } from 'src/globals/api/types'

export type LocationDepth = 1 | 2 | 3

export function getDepthLabel(depth: LocationDepth): string {
    return i18n.t(`adminBuildings:depth.${depth}`)
}

export function getDepthSubtitle(depth: LocationDepth): string {
    return i18n.t(`adminBuildings:depthSubtitle.${depth}`)
}

export function getCreateTitle(depth: LocationDepth): string {
    return i18n.t('adminBuildings:addDepth', { depth: getDepthLabel(depth) })
}

export function getEditTitle(node: AdminLocationNode): string {
    return i18n.t('adminBuildings:editDepthKind', {
        depth: getDepthLabel(node.depth as LocationDepth),
        kind: getNodeKindLabel(node.nodeKind),
    })
}

export function findNode(
    nodes: AdminLocationNode[],
    id: number,
): AdminLocationNode | null {
    for (const node of nodes) {
        if (node.id === id) return node
        const found = findNode(node.children ?? [], id)
        if (found) return found
    }
    return null
}

export function getBreadcrumb(
    tree: AdminLocationNode[],
    nodeId: number,
): string[] {
    const path: string[] = []

    function walk(nodes: AdminLocationNode[], trail: string[]): boolean {
        for (const node of nodes) {
            const next = [...trail, node.name]
            if (node.id === nodeId) {
                path.push(...next)
                return true
            }
            if (walk(node.children ?? [], next)) return true
        }
        return false
    }

    walk(tree, [])
    return path
}

export function getBuildingNodes(tree: AdminLocationNode[]): AdminLocationNode[] {
    return tree
}

export function getMiddleNodes(
    tree: AdminLocationNode[],
    buildingId?: number,
): AdminLocationNode[] {
    if (!buildingId) return []
    return findNode(tree, buildingId)?.children ?? []
}

export function getRoomNodes(
    tree: AdminLocationNode[],
    middleId?: number,
): AdminLocationNode[] {
    if (!middleId) return []
    const middle = findNode(tree, middleId)
    if (!middle || middle.nodeKind !== 'GROUP') return []
    return middle.children ?? []
}

export function isThirdColumnActive(
    tree: AdminLocationNode[],
    middleId?: number,
): boolean {
    if (!middleId) return false
    const middle = findNode(tree, middleId)
    return middle?.nodeKind === 'GROUP'
}

export function getDefaultNodeKindForCreate(
    depth: LocationDepth,
): NodeKind {
    if (depth === 1) return 'GROUP'
    if (depth === 3) return 'LEAF'
    return 'GROUP'
}

export function getCreatePlaceholder(depth: LocationDepth, kind?: NodeKind): string {
    if (depth === 1) {
        return kind === 'LEAF'
            ? i18n.t('adminBuildings:placeholder.depth1.leaf')
            : i18n.t('adminBuildings:placeholder.depth1.group')
    }
    if (depth === 2) {
        return kind === 'LEAF'
            ? i18n.t('adminBuildings:placeholder.depth2.leaf')
            : i18n.t('adminBuildings:placeholder.depth2.group')
    }
    return i18n.t('adminBuildings:placeholder.depth3.leaf')
}

export function getNodeKindLabel(kind: NodeKind): string {
    return kind === 'GROUP'
        ? i18n.t('adminBuildings:nodeKind.group')
        : i18n.t('adminBuildings:nodeKind.leaf')
}

export function getAvailableNodeKindsForCreate(depth: LocationDepth): NodeKind[] {
    if (depth === 3) return ['LEAF']
    return ['GROUP', 'LEAF']
}

export function isNodeKindChoiceDisabled(depth: LocationDepth): boolean {
    return depth === 3
}

export function getNodeKindHint(depth: LocationDepth, kind: NodeKind): string {
    if (depth === 1) {
        return kind === 'GROUP'
            ? i18n.t('adminBuildings:nodeKindHint.depth1.group')
            : i18n.t('adminBuildings:nodeKindHint.depth1.leaf')
    }
    if (depth === 2) {
        return kind === 'GROUP'
            ? i18n.t('adminBuildings:nodeKindHint.depth2.group')
            : i18n.t('adminBuildings:nodeKindHint.depth2.leaf')
    }
    return i18n.t('adminBuildings:nodeKindHint.depth3')
}
