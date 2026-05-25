import { useTranslation } from 'react-i18next'
import {
    Building2,
    ChevronRight,
    DoorOpen,
    Layers,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { ScrollArea } from 'src/shared/lib/shadcn/components/ui/scroll-area'
import { EcoButton } from 'src/shared/ui/eco'
import type { AdminLocationNode } from 'src/globals/api/types'
import type { LocationDepth } from 'src/features/admin/buildings/locationTreeUtils'
import { getNodeKindLabel } from 'src/features/admin/buildings/locationTreeUtils'

function NodeIcon({
    depth,
    nodeKind,
}: {
    depth: LocationDepth
    nodeKind: AdminLocationNode['nodeKind']
}) {
    if (depth === 1) return <Building2 className="text-primary h-4 w-4 shrink-0" />
    if (nodeKind === 'GROUP')
        return <Layers className="text-on-surface-variant h-4 w-4 shrink-0" />
    return <DoorOpen className="text-secondary h-4 w-4 shrink-0" />
}

export const LocationColumn = ({
    title,
    subtitle,
    items,
    selectedId,
    depth,
    loading,
    canAdd,
    emptyMessage,
    emptyActionLabel,
    disabled,
    onSelect,
    onAdd,
    onEdit,
    onDelete,
    onEmptyAction,
}: {
    title: string
    subtitle?: string
    items: AdminLocationNode[]
    selectedId?: number
    depth: LocationDepth
    loading?: boolean
    canAdd?: boolean
    emptyMessage: string
    emptyActionLabel?: string
    disabled?: boolean
    onSelect: (id: number) => void
    onAdd?: () => void
    onEdit?: (node: AdminLocationNode) => void
    onDelete?: (node: AdminLocationNode) => void
    onEmptyAction?: () => void
}) => {
    const { t } = useTranslation('adminBuildings')
    const showChevron = depth < 3

    return (
        <div
            className={cn(
                'border-outline-variant flex min-h-[420px] flex-col border-b md:min-h-[520px] md:border-r md:border-b-0 md:last:border-r-0',
                disabled && 'opacity-60',
            )}
        >
            <div className="border-outline-variant bg-surface-container-low flex items-start justify-between gap-2 border-b px-4 py-3">
                <div className="min-w-0">
                    <h3 className="truncate font-bold">{title}</h3>
                    {subtitle && (
                        <p className="text-on-surface-variant mt-0.5 truncate text-xs">
                            {subtitle}
                        </p>
                    )}
                </div>
                {canAdd && onAdd && (
                    <EcoButton
                        type="button"
                        variant="ghost"
                        className="shrink-0 px-2 py-1.5"
                        onClick={onAdd}
                        title={t('columnAddTitle', { title })}
                    >
                        <Plus className="h-4 w-4" />
                    </EcoButton>
                )}
            </div>

            <ScrollArea className="flex-1">
                {loading ? (
                    <p className="text-on-surface-variant p-6 text-center text-sm">
                        {t('column.loading')}
                    </p>
                ) : disabled ? (
                    <p className="text-on-surface-variant p-6 text-center text-sm">
                        {emptyMessage}
                    </p>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                        <p className="text-on-surface-variant text-sm">
                            {emptyMessage}
                        </p>
                        {emptyActionLabel && onEmptyAction && (
                            <EcoButton
                                type="button"
                                variant="outline"
                                className="text-xs"
                                onClick={onEmptyAction}
                            >
                                <Plus className="mr-1 h-3.5 w-3.5" />
                                {emptyActionLabel}
                            </EcoButton>
                        )}
                    </div>
                ) : (
                    <ul className="p-2">
                        {items.map((item) => {
                            const isSelected = selectedId === item.id
                            return (
                                <li key={item.id}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className={cn(
                                            'group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 transition-colors',
                                            isSelected
                                                ? 'bg-primary-container/30 ring-primary-container ring-1'
                                                : 'hover:bg-surface-container-low/60',
                                        )}
                                        onClick={() => onSelect(item.id)}
                                        onDoubleClick={() => onEdit?.(item)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                onSelect(item.id)
                                            }
                                        }}
                                    >
                                        <NodeIcon
                                            depth={depth}
                                            nodeKind={item.nodeKind}
                                        />
                                        <span className="min-w-0 flex-1 truncate font-medium">
                                            {item.name}
                                        </span>
                                        <span
                                            className={cn(
                                                'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold',
                                                item.nodeKind === 'GROUP'
                                                    ? 'bg-primary-container/40 text-on-primary-container'
                                                    : 'bg-secondary-container/60 text-on-secondary-container',
                                            )}
                                        >
                                            {getNodeKindLabel(item.nodeKind)}
                                        </span>
                                        {item.nodeKind === 'GROUP' &&
                                            (item.children?.length ?? 0) > 0 && (
                                                <span className="text-on-surface-variant text-[10px] font-bold">
                                                    {item.children!.length}
                                                </span>
                                            )}
                                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    className="text-on-surface-variant hover:text-primary rounded p-1"
                                                    title={t('column.edit')}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onEdit(item)
                                                    }}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    className="text-on-surface-variant hover:text-error rounded p-1"
                                                    title={t('column.delete')}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onDelete(item)
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        {showChevron &&
                                            item.nodeKind === 'GROUP' && (
                                                <ChevronRight className="text-on-surface-variant h-4 w-4 shrink-0 opacity-50" />
                                            )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </ScrollArea>
        </div>
    )
}
