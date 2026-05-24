import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
    Building2,
    ChevronDown,
    ChevronRight,
    FolderTree,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import { EcoButton, EcoCard } from 'src/shared/ui/eco'
import { getAffiliations } from 'src/globals/api/affiliationsApi'
import {
    createLocationNode,
    deleteLocationNode,
    getLocationNodeTree,
    updateLocationNode,
} from 'src/globals/api/locationNodesApi'
import type { AdminLocationNode, Affiliation, NodeKind } from 'src/globals/api/types'

type AddTarget = { parentId?: number; maxDepth: number } | null

const NodeKindBadge = ({ kind }: { kind: NodeKind }) => (
    <span
        className={
            kind === 'GROUP'
                ? 'bg-primary-container text-on-primary-container rounded px-2 py-0.5 text-[10px] font-bold'
                : 'bg-secondary-container text-on-secondary-container rounded px-2 py-0.5 text-[10px] font-bold'
        }
    >
        {kind === 'GROUP' ? '그룹' : '장소'}
    </span>
)

const TreeRow = ({
    node,
    editingNodeId,
    onAddChild,
    onDelete,
    onEdit,
}: {
    node: AdminLocationNode
    editingNodeId: number | null
    onAddChild: (parentId: number, depth: number) => void
    onDelete: (node: AdminLocationNode) => void
    onEdit: (node: AdminLocationNode) => void
}) => {
    const [expanded, setExpanded] = useState(true)
    const children = node.children ?? []
    const hasChildren = children.length > 0
    const canAddChild = node.nodeKind === 'GROUP' && node.depth < 3
    const isEditing = editingNodeId === node.id

    return (
        <div>
            <div
                className={cn(
                    'flex items-center gap-2 rounded-lg py-2 pr-2',
                    isEditing
                        ? 'bg-primary-container/20 ring-primary-container ring-1'
                        : 'hover:bg-surface-container-low/40',
                )}
                style={{ paddingLeft: `${(node.depth - 1) * 20 + 8}px` }}
            >
                <button
                    type="button"
                    className="text-on-surface-variant shrink-0 disabled:opacity-30"
                    disabled={!hasChildren}
                    onClick={() => setExpanded((v) => !v)}
                >
                    {hasChildren ? (
                        expanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )
                    ) : (
                        <span className="inline-block w-4" />
                    )}
                </button>
                <span className="flex-1 font-medium">{node.name}</span>
                <NodeKindBadge kind={node.nodeKind} />
                <span className="text-on-surface-variant text-xs">
                    {node.depth}뎁스
                </span>
                <button
                    type="button"
                    className="text-on-surface-variant hover:text-primary text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isEditing}
                    onClick={() => onEdit(node)}
                >
                    {isEditing ? '수정 중' : '수정'}
                </button>
                {canAddChild && (
                    <button
                        type="button"
                        className="text-primary text-xs font-bold"
                        onClick={() => onAddChild(node.id, node.depth)}
                    >
                        하위 추가
                    </button>
                )}
                <button
                    type="button"
                    className="text-error hover:text-error/80"
                    onClick={() => onDelete(node)}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
            {expanded &&
                children.map((child) => (
                    <TreeRow
                        key={child.id}
                        node={child}
                        editingNodeId={editingNodeId}
                        onAddChild={onAddChild}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
        </div>
    )
}

export const AdminBuildings = () => {
    const [affiliations, setAffiliations] = useState<Affiliation[]>([])
    const [affiliationId, setAffiliationId] = useState<number | ''>('')
    const [tree, setTree] = useState<AdminLocationNode[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [addTarget, setAddTarget] = useState<AddTarget>(null)
    const [editTarget, setEditTarget] = useState<AdminLocationNode | null>(
        null,
    )
    const [newName, setNewName] = useState('')
    const [newKind, setNewKind] = useState<NodeKind>('GROUP')
    const [editName, setEditName] = useState('')

    const loadAffiliations = useCallback(() => {
        void getAffiliations()
            .then((items) => {
                const list = Array.isArray(items) ? items : []
                setAffiliations(list)
                if (list.length > 0) {
                    setAffiliationId((prev) => prev || list[0].affiliationId)
                }
            })
            .catch(() => toast.error('소속 목록을 불러오지 못했습니다.'))
    }, [])

    const loadTree = useCallback(() => {
        if (!affiliationId) {
            setTree([])
            setLoading(false)
            return
        }

        setLoading(true)
        void getLocationNodeTree(Number(affiliationId))
            .then((nodes) =>
                setTree(Array.isArray(nodes) ? nodes : []),
            )
            .catch(() => toast.error('장소 트리를 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [affiliationId])

    useEffect(() => {
        loadAffiliations()
    }, [loadAffiliations])

    useEffect(() => {
        loadTree()
    }, [loadTree])

    const cancelEdit = () => {
        setEditTarget(null)
        setEditName('')
    }

    const openEdit = (node: AdminLocationNode) => {
        setAddTarget(null)
        setEditTarget(node)
        setEditName(node.name)
    }

    const openRootAdd = () => {
        cancelEdit()
        setAddTarget({ maxDepth: 1 })
        setNewName('')
        setNewKind('GROUP')
    }

    const openChildAdd = (parentId: number, parentDepth: number) => {
        cancelEdit()
        setAddTarget({ parentId, maxDepth: parentDepth + 1 })
        setNewName('')
        setNewKind(parentDepth + 1 >= 3 ? 'LEAF' : 'GROUP')
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim() || !affiliationId || !addTarget) {
            toast.error('이름과 소속을 확인해 주세요.')
            return
        }

        setSubmitting(true)
        try {
            await createLocationNode({
                parentId: addTarget.parentId,
                affiliationId: Number(affiliationId),
                name: newName.trim(),
                nodeKind: newKind,
            })
            toast.success('장소가 등록되었습니다.')
            setAddTarget(null)
            setNewName('')
            loadTree()
        } catch {
            toast.error('장소 등록에 실패했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editTarget) {
            return
        }
        if (!editName.trim()) {
            toast.error('이름을 입력해 주세요.')
            return
        }
        if (editName.trim() === editTarget.name) {
            cancelEdit()
            return
        }

        setSubmitting(true)
        try {
            await updateLocationNode(editTarget.id, { name: editName.trim() })
            toast.success('이름이 수정되었습니다.')
            cancelEdit()
            loadTree()
        } catch {
            toast.error('수정에 실패했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (node: AdminLocationNode) => {
        if (
            !window.confirm(
                `"${node.name}"을(를) 삭제할까요? 하위 장소나 제보가 있으면 삭제할 수 없습니다.`,
            )
        ) {
            return
        }

        try {
            await deleteLocationNode(node.id)
            if (editTarget?.id === node.id) {
                cancelEdit()
            }
            toast.success('삭제되었습니다.')
            loadTree()
        } catch {
            toast.error('삭제에 실패했습니다.')
        }
    }

    const addFormTitle = addTarget?.parentId
        ? '하위 장소 추가'
        : '최상위 장소 추가'

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title="건물·강의실 관리" />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div>
                        <h2 className="mb-1 text-3xl font-bold">
                            건물·강의실 관리
                        </h2>
                        <p className="text-on-surface-variant text-sm">
                            최대 3뎁스까지 그룹·장소를 자유롭게 구성합니다.
                            (예: 공학관 → 101호 / 공학관 → 2층 → 201호)
                        </p>
                    </div>

                    <EcoCard className="p-6">
                        <div className="mb-4 flex flex-wrap items-end gap-4">
                            <div className="flex min-w-[200px] flex-col gap-1.5">
                                <label className="text-on-surface-variant text-xs font-bold">
                                    소속
                                </label>
                                <select
                                    value={affiliationId}
                                    onChange={(e) =>
                                        setAffiliationId(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        )
                                    }
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3 outline-none focus:ring-2"
                                >
                                    {affiliations.map((a) => (
                                        <option
                                            key={a.affiliationId}
                                            value={a.affiliationId}
                                        >
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <EcoButton
                                type="button"
                                onClick={openRootAdd}
                                className="px-6 py-3"
                            >
                                <Plus className="mr-1 inline h-4 w-4" />
                                최상위 추가
                            </EcoButton>
                        </div>

                        {addTarget && (
                            <form
                                onSubmit={(e) => void handleCreate(e)}
                                className="border-outline-variant bg-surface-container-low mb-4 flex flex-wrap items-end gap-4 rounded-lg border p-4"
                            >
                                <h3 className="flex w-full items-center gap-2 text-sm font-bold">
                                    <FolderTree className="h-4 w-4" />
                                    {addFormTitle}
                                </h3>
                                <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                                    <label className="text-on-surface-variant text-xs font-bold">
                                        이름
                                    </label>
                                    <input
                                        value={newName}
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
                                        placeholder={
                                            addTarget.parentId
                                                ? '201호'
                                                : '공학관 A동'
                                        }
                                        className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3 outline-none focus:ring-2"
                                    />
                                </div>
                                <div className="flex w-36 flex-col gap-1.5">
                                    <label className="text-on-surface-variant text-xs font-bold">
                                        유형
                                    </label>
                                    <select
                                        value={newKind}
                                        onChange={(e) =>
                                            setNewKind(
                                                e.target.value as NodeKind,
                                            )
                                        }
                                        disabled={addTarget.maxDepth >= 3}
                                        className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3 outline-none focus:ring-2 disabled:opacity-60"
                                    >
                                        <option value="GROUP">그룹</option>
                                        <option value="LEAF">장소</option>
                                    </select>
                                </div>
                                <EcoButton
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-3"
                                >
                                    {submitting ? '등록 중...' : '등록'}
                                </EcoButton>
                                <EcoButton
                                    type="button"
                                    variant="outline"
                                    onClick={() => setAddTarget(null)}
                                    className="px-6 py-3"
                                >
                                    취소
                                </EcoButton>
                            </form>
                        )}

                        {editTarget && (
                            <form
                                onSubmit={(e) => void handleUpdate(e)}
                                className="border-outline-variant bg-surface-container-low flex flex-wrap items-end gap-4 rounded-lg border p-4"
                            >
                                <h3 className="flex w-full items-center gap-2 text-sm font-bold">
                                    <Pencil className="h-4 w-4" />
                                    장소 수정
                                    <NodeKindBadge kind={editTarget.nodeKind} />
                                    <span className="text-on-surface-variant text-xs font-normal">
                                        {editTarget.depth}뎁스
                                    </span>
                                </h3>
                                <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                                    <label className="text-on-surface-variant text-xs font-bold">
                                        이름
                                    </label>
                                    <input
                                        value={editName}
                                        onChange={(e) =>
                                            setEditName(e.target.value)
                                        }
                                        placeholder="공학관 A동"
                                        autoFocus
                                        className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3 outline-none focus:ring-2"
                                    />
                                </div>
                                <div className="flex w-36 flex-col gap-1.5">
                                    <label className="text-on-surface-variant text-xs font-bold">
                                        유형
                                    </label>
                                    <div className="border-outline-variant bg-surface-container text-on-surface-variant rounded-lg border p-3 text-sm">
                                        {editTarget.nodeKind === 'GROUP'
                                            ? '그룹'
                                            : '장소'}
                                    </div>
                                </div>
                                <EcoButton
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-3"
                                >
                                    {submitting ? '저장 중...' : '저장'}
                                </EcoButton>
                                <EcoButton
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEdit}
                                    className="px-6 py-3"
                                >
                                    취소
                                </EcoButton>
                            </form>
                        )}
                    </EcoCard>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="border-outline-variant bg-surface-container-low border-b p-4">
                            <h3 className="flex items-center gap-2 font-bold">
                                <Building2 className="h-5 w-5" /> 장소 트리
                            </h3>
                        </div>
                        {loading ? (
                            <p className="text-on-surface-variant p-8 text-center text-sm">
                                불러오는 중...
                            </p>
                        ) : tree.length === 0 ? (
                            <p className="text-on-surface-variant p-8 text-center text-sm">
                                등록된 장소가 없습니다. 최상위 그룹 또는
                                장소를 추가해 주세요.
                            </p>
                        ) : (
                            <div className="divide-outline-variant/30 divide-y p-2">
                                {tree.map((node) => (
                                    <TreeRow
                                        key={node.id}
                                        node={node}
                                        editingNodeId={editTarget?.id ?? null}
                                        onAddChild={openChildAdd}
                                        onDelete={handleDelete}
                                        onEdit={openEdit}
                                    />
                                ))}
                            </div>
                        )}
                    </EcoCard>
                </main>
            </div>
        </>
    )
}
