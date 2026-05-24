import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from 'src/shared/lib/shadcn/components/ui/sheet'
import { Input } from 'src/shared/lib/shadcn/components/ui/input'
import { Label } from 'src/shared/lib/shadcn/components/ui/label'
import { EcoButton } from 'src/shared/ui/eco'
import type { AdminLocationNode, NodeKind } from 'src/globals/api/types'
import type { SheetState } from 'src/features/admin/buildings/useLocationTree'
import {
    getAvailableNodeKindsForCreate,
    getCreatePlaceholder,
    getCreateTitle,
    getDefaultNodeKindForCreate,
    getEditTitle,
    getNodeKindHint,
    getNodeKindLabel,
    isNodeKindChoiceDisabled,
    type LocationDepth,
} from 'src/features/admin/buildings/locationTreeUtils'

const NodeKindField = ({
    id,
    value,
    depth,
    disabled,
    onChange,
}: {
    id: string
    value: NodeKind
    depth: LocationDepth
    disabled?: boolean
    onChange?: (kind: NodeKind) => void
}) => {
    const options = getAvailableNodeKindsForCreate(depth)
    const choiceDisabled = disabled || isNodeKindChoiceDisabled(depth)

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>유형</Label>
            <select
                id={id}
                value={value}
                disabled={choiceDisabled}
                onChange={(e) => onChange?.(e.target.value as NodeKind)}
                className="border-outline-variant bg-surface focus:ring-primary-container h-11 rounded-md border px-3 text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {options.map((kind) => (
                    <option key={kind} value={kind}>
                        {getNodeKindLabel(kind)}
                    </option>
                ))}
            </select>
            <p className="text-on-surface-variant text-xs">
                {getNodeKindHint(depth, value)}
            </p>
        </div>
    )
}

export const LocationFormSheet = ({
    sheet,
    breadcrumb,
    submitting,
    startWithDeleteConfirm = false,
    onClose,
    onCreate,
    onUpdate,
    onDelete,
}: {
    sheet: SheetState
    breadcrumb: string[]
    submitting: boolean
    startWithDeleteConfirm?: boolean
    onClose: () => void
    onCreate: (name: string, nodeKind: NodeKind) => Promise<boolean>
    onUpdate: (name: string) => Promise<boolean>
    onDelete: (node: AdminLocationNode) => Promise<boolean>
}) => {
    const open = sheet !== null
    const isEdit = sheet?.mode === 'edit'
    const depth: LocationDepth | undefined =
        sheet?.mode === 'create' ? sheet.depth : (sheet?.node.depth as LocationDepth)

    const [name, setName] = useState('')
    const [nodeKind, setNodeKind] = useState<NodeKind>('GROUP')
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        if (!sheet) {
            setName('')
            setNodeKind('GROUP')
            setConfirmDelete(false)
            return
        }
        if (sheet.mode === 'edit') {
            setName(sheet.node.name)
            setNodeKind(sheet.node.nodeKind)
        } else {
            setName('')
            setNodeKind(getDefaultNodeKindForCreate(sheet.depth))
        }
        setConfirmDelete(startWithDeleteConfirm)
    }, [sheet, startWithDeleteConfirm])

    const title =
        sheet?.mode === 'edit'
            ? getEditTitle(sheet.node)
            : sheet?.mode === 'create'
              ? getCreateTitle(sheet.depth)
              : ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        if (isEdit && sheet?.mode === 'edit') {
            await onUpdate(name)
        } else if (sheet?.mode === 'create') {
            await onCreate(name, nodeKind)
        }
    }

    const handleDelete = async () => {
        if (!sheet || sheet.mode !== 'edit') return
        if (!confirmDelete) {
            setConfirmDelete(true)
            return
        }
        await onDelete(sheet.node)
    }

    return (
        <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
            <SheetContent side="right" className="bg-surface w-full sm:max-w-md">
                <form
                    onSubmit={(e) => void handleSubmit(e)}
                    className="flex h-full flex-col"
                >
                    <SheetHeader className="border-outline-variant border-b pb-4">
                        <SheetTitle className="text-lg">{title}</SheetTitle>
                        {breadcrumb.length > 0 && (
                            <SheetDescription asChild>
                                <div className="text-on-surface-variant flex flex-wrap items-center gap-1 text-xs">
                                    {breadcrumb.map((part, i) => (
                                        <span
                                            key={`${part}-${i}`}
                                            className="flex items-center gap-1"
                                        >
                                            {i > 0 && (
                                                <ChevronRight className="h-3 w-3" />
                                            )}
                                            <span>{part}</span>
                                        </span>
                                    ))}
                                </div>
                            </SheetDescription>
                        )}
                    </SheetHeader>

                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {depth && (
                            <NodeKindField
                                id="location-kind"
                                value={nodeKind}
                                depth={depth}
                                disabled={isEdit}
                                onChange={isEdit ? undefined : setNodeKind}
                            />
                        )}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="location-name">이름</Label>
                            <Input
                                id="location-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={
                                    depth
                                        ? getCreatePlaceholder(
                                              depth,
                                              isEdit ? undefined : nodeKind,
                                          )
                                        : ''
                                }
                                autoFocus
                                className="border-outline-variant bg-surface h-11"
                            />
                        </div>

                        {isEdit && (
                            <p className="text-on-surface-variant text-xs">
                                유형은 등록 후 변경할 수 없습니다.
                            </p>
                        )}
                    </div>

                    <SheetFooter className="border-outline-variant gap-2 border-t pt-4">
                        <EcoButton
                            type="submit"
                            disabled={submitting || !name.trim()}
                            className="w-full py-3"
                        >
                            {submitting
                                ? '저장 중...'
                                : isEdit
                                  ? '저장'
                                  : '등록'}
                        </EcoButton>
                        <EcoButton
                            type="button"
                            variant="outline"
                            className="w-full py-3"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            취소
                        </EcoButton>
                        {isEdit && sheet?.mode === 'edit' && (
                            <EcoButton
                                type="button"
                                variant="error"
                                className="w-full py-3"
                                onClick={() => void handleDelete()}
                                disabled={submitting}
                            >
                                {confirmDelete
                                    ? '정말 삭제할까요? (한 번 더 클릭)'
                                    : '삭제'}
                            </EcoButton>
                        )}
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
