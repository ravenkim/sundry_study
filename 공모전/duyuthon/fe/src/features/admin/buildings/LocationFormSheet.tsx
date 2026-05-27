import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import type { AdminLocationNode, LocationLeafPayload, NodeKind } from 'src/globals/api/types'
import {
    defaultOperatingSchedules,
    normalizeOperatingSchedules,
    toApiOperatingSchedules,
    type OperatingScheduleItem,
} from 'src/features/admin/buildings/operatingScheduleUtils'
import { LeafOperatingScheduleFields } from 'src/features/admin/buildings/LeafOperatingScheduleFields'
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
    const { t } = useTranslation('adminBuildings')
    const options = getAvailableNodeKindsForCreate(depth)
    const choiceDisabled = disabled || isNodeKindChoiceDisabled(depth)

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{t('form.typeLabel')}</Label>
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

const LeafResourceFields = ({
    acCount,
    fluorescentCount,
    ledCount,
    disabled,
    onAcCountChange,
    onFluorescentCountChange,
    onLedCountChange,
}: {
    acCount: string
    fluorescentCount: string
    ledCount: string
    disabled?: boolean
    onAcCountChange: (value: string) => void
    onFluorescentCountChange: (value: string) => void
    onLedCountChange: (value: string) => void
}) => {
    const { t } = useTranslation('adminBuildings')

    return (
        <div className="border-outline-variant flex flex-col gap-4 rounded-lg border p-4">
            <div>
                <p className="text-sm font-medium">{t('form.resources.title')}</p>
                <p className="text-on-surface-variant mt-1 text-xs">
                    {t('form.resources.description')}
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="location-ac-count">
                    {t('form.resources.acCount')}
                </Label>
                <Input
                    id="location-ac-count"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={acCount}
                    disabled={disabled}
                    onChange={(e) => onAcCountChange(e.target.value)}
                    className="border-outline-variant bg-surface h-11"
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="location-fluorescent-count">
                    {t('form.resources.fluorescentCount')}
                </Label>
                <Input
                    id="location-fluorescent-count"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={fluorescentCount}
                    disabled={disabled}
                    onChange={(e) => onFluorescentCountChange(e.target.value)}
                    className="border-outline-variant bg-surface h-11"
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="location-led-count">
                    {t('form.resources.ledCount')}
                </Label>
                <Input
                    id="location-led-count"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={ledCount}
                    disabled={disabled}
                    onChange={(e) => onLedCountChange(e.target.value)}
                    className="border-outline-variant bg-surface h-11"
                />
            </div>
        </div>
    )
}

const parseResourceCount = (value: string): number | null => {
    const trimmed = value.trim()
    if (trimmed === '') return 0
    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isNaN(parsed) || parsed < 0) return null
    return parsed
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
    onCreate: (
        name: string,
        nodeKind: NodeKind,
        leafPayload?: LocationLeafPayload,
    ) => Promise<boolean>
    onUpdate: (
        name: string,
        leafPayload?: LocationLeafPayload,
    ) => Promise<boolean>
    onDelete: (node: AdminLocationNode) => Promise<boolean>
}) => {
    const { t } = useTranslation('adminBuildings')
    const open = sheet !== null
    const isEdit = sheet?.mode === 'edit'
    const depth: LocationDepth | undefined =
        sheet?.mode === 'create' ? sheet.depth : (sheet?.node.depth as LocationDepth)

    const [name, setName] = useState('')
    const [nodeKind, setNodeKind] = useState<NodeKind>('GROUP')
    const [acCount, setAcCount] = useState('0')
    const [fluorescentCount, setFluorescentCount] = useState('0')
    const [ledCount, setLedCount] = useState('0')
    const [operatingSchedules, setOperatingSchedules] = useState<
        OperatingScheduleItem[]
    >(defaultOperatingSchedules())
    const [confirmDelete, setConfirmDelete] = useState(false)

    const showLeafResources =
        (sheet?.mode === 'create' && nodeKind === 'LEAF') ||
        (sheet?.mode === 'edit' && sheet.node.nodeKind === 'LEAF')

    useEffect(() => {
        if (!sheet) {
            setName('')
            setNodeKind('GROUP')
            setAcCount('0')
            setFluorescentCount('0')
            setLedCount('0')
            setOperatingSchedules(defaultOperatingSchedules())
            setConfirmDelete(false)
            return
        }
        if (sheet.mode === 'edit') {
            setName(sheet.node.name)
            setNodeKind(sheet.node.nodeKind)
            setAcCount(String(sheet.node.acCount ?? 0))
            setFluorescentCount(String(sheet.node.fluorescentCount ?? 0))
            setLedCount(String(sheet.node.ledCount ?? 0))
            setOperatingSchedules(
                normalizeOperatingSchedules(sheet.node.operatingSchedules),
            )
        } else {
            setName('')
            setNodeKind(getDefaultNodeKindForCreate(sheet.depth))
            setAcCount('0')
            setFluorescentCount('0')
            setLedCount('0')
            setOperatingSchedules(defaultOperatingSchedules())
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

        let leafPayload: LocationLeafPayload | undefined
        if (showLeafResources) {
            const parsedAc = parseResourceCount(acCount)
            const parsedFluorescent = parseResourceCount(fluorescentCount)
            const parsedLed = parseResourceCount(ledCount)
            if (
                parsedAc === null ||
                parsedFluorescent === null ||
                parsedLed === null
            ) {
                return
            }
            leafPayload = {
                acCount: parsedAc,
                fluorescentCount: parsedFluorescent,
                ledCount: parsedLed,
                operatingSchedules: toApiOperatingSchedules(operatingSchedules),
            }
        }

        if (isEdit && sheet?.mode === 'edit') {
            await onUpdate(name, leafPayload)
        } else if (sheet?.mode === 'create') {
            await onCreate(name, nodeKind, leafPayload)
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

                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
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
                            <Label htmlFor="location-name">
                                {t('form.nameLabel')}
                            </Label>
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

                        {showLeafResources && (
                            <>
                                <LeafResourceFields
                                    acCount={acCount}
                                    fluorescentCount={fluorescentCount}
                                    ledCount={ledCount}
                                    disabled={submitting}
                                    onAcCountChange={setAcCount}
                                    onFluorescentCountChange={
                                        setFluorescentCount
                                    }
                                    onLedCountChange={setLedCount}
                                />
                                <LeafOperatingScheduleFields
                                    schedules={operatingSchedules}
                                    disabled={submitting}
                                    onChange={setOperatingSchedules}
                                />
                            </>
                        )}

                        {isEdit && (
                            <p className="text-on-surface-variant text-xs">
                                {t('form.typeLockedHint')}
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
                                ? t('form.saving')
                                : isEdit
                                  ? t('form.save')
                                  : t('form.register')}
                        </EcoButton>
                        <EcoButton
                            type="button"
                            variant="outline"
                            className="w-full py-3"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            {t('form.cancel')}
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
                                    ? t('form.deleteConfirm')
                                    : t('form.delete')}
                            </EcoButton>
                        )}
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
