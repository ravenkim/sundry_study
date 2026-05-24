import type { AdminLocationNode, NodeKind } from 'src/globals/api/types'

export type LocationDepth = 1 | 2 | 3

/** 관리자 장소 관리 화면 공통 용어 */
export const LOC = {
    pageTitle: '장소 관리',
    navLabel: '장소 관리',
    pageDescription:
        '그룹과 항목을 조합해 최대 3단계까지 구성합니다. 항목은 제보 시 선택되는 장소입니다.',
    depth: {
        1: '1단계',
        2: '2단계',
        3: '3단계',
    } as Record<LocationDepth, string>,
    depthSubtitle: {
        1: '그룹 · 항목',
        2: '하위 그룹 · 항목',
        3: '항목',
    } as Record<LocationDepth, string>,
    group: '그룹',
    leaf: '항목',
    addDepth: (depth: LocationDepth) => `${LOC.depth[depth]} 추가`,
    editDepthKind: (depth: LocationDepth, kind: NodeKind) =>
        `${LOC.depth[depth]} ${kind === 'GROUP' ? LOC.group : LOC.leaf} 수정`,
    empty: {
        depth1: '등록된 장소가 없습니다.',
        depth1Action: '1단계 추가',
        selectDepth1: '1단계에서 항목을 선택하세요.',
        depth2Add: '하위 그룹 또는 항목을 추가해 보세요.',
        depth2Action: '추가',
        selectDepth2Group: '2단계에서 그룹을 선택하세요.',
        depth3DirectLeaf:
            '2단계가 항목이라 3단계가 필요 없습니다. (공학관 → 303호처럼 2단계 구조)',
        depth3Add: '항목을 추가해 보세요.',
        depth3Action: '항목 추가',
    },
    toast: {
        selectParent: '먼저 상위 항목을 선택해 주세요.',
        selectGroup: '먼저 그룹을 선택해 주세요.',
        selectGroupForLeaf: '그룹을 선택한 뒤 항목을 추가해 주세요.',
    },
} as const

export const DEPTH_LABELS = LOC.depth

export function getDepthLabel(depth: LocationDepth): string {
    return LOC.depth[depth]
}

export function getDepthSubtitle(depth: LocationDepth): string {
    return LOC.depthSubtitle[depth]
}

export function getCreateTitle(depth: LocationDepth): string {
    return LOC.addDepth(depth)
}

export function getEditTitle(node: AdminLocationNode): string {
    return LOC.editDepthKind(node.depth as LocationDepth, node.nodeKind)
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
    if (depth === 1) return kind === 'LEAF' ? '야외 구역' : '공학관 A동'
    if (depth === 2) return kind === 'LEAF' ? '303호' : '2층'
    return '201호'
}

export const NODE_KIND_LABELS: Record<NodeKind, string> = {
    GROUP: LOC.group,
    LEAF: LOC.leaf,
}

export function getNodeKindLabel(kind: NodeKind): string {
    return NODE_KIND_LABELS[kind]
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
            ? '그룹은 하위에 또 다른 그룹이나 항목을 둘 수 있습니다.'
            : '항목은 제보 시 바로 선택할 수 있는 장소입니다.'
    }
    if (depth === 2) {
        return kind === 'GROUP'
            ? '그룹을 선택하면 3단계에서 하위 항목을 추가할 수 있습니다.'
            : '항목은 상위 그룹에 바로 연결되는 제보 대상입니다.'
    }
    return '3단계는 항목만 등록할 수 있습니다.'
}
