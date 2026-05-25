import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from 'src/shared/lib/shadcn/components/ui/sheet'
import { EcoButton } from 'src/shared/ui/eco'
import { LeafOperatingScheduleFields } from 'src/features/admin/buildings/LeafOperatingScheduleFields'
import {
    normalizeOperatingSchedules,
    type OperatingScheduleItem,
} from 'src/features/admin/buildings/operatingScheduleUtils'
import type { ScheduleMatrixRow } from 'src/features/admin/schedules/scheduleMatrixUtils'

export function ScheduleEditSheet({
    target,
    submitting,
    onClose,
    onSave,
}: {
    target: ScheduleMatrixRow | null
    submitting: boolean
    onClose: () => void
    onSave: (row: ScheduleMatrixRow, schedules: OperatingScheduleItem[]) => void
}) {
    const { t } = useTranslation('adminSchedules')
    const [schedules, setSchedules] = useState<OperatingScheduleItem[]>(
        normalizeOperatingSchedules(),
    )

    useEffect(() => {
        if (target) {
            setSchedules(normalizeOperatingSchedules(target.schedules))
        }
    }, [target])

    return (
        <Sheet open={target != null} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="border-outline-variant flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
                <SheetHeader className="border-outline-variant border-b pb-4">
                    <SheetTitle>{t('editSheet.title')}</SheetTitle>
                    <SheetDescription>
                        {target?.pathLabel ?? ''}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 py-4">
                    <LeafOperatingScheduleFields
                        schedules={schedules}
                        disabled={submitting}
                        onChange={setSchedules}
                    />
                </div>

                <SheetFooter className="border-outline-variant flex-row gap-2 border-t pt-4">
                    <EcoButton
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={submitting}
                        onClick={onClose}
                    >
                        {t('editSheet.cancel')}
                    </EcoButton>
                    <EcoButton
                        type="button"
                        className="flex-1"
                        disabled={submitting || !target}
                        onClick={() => target && onSave(target, schedules)}
                    >
                        {submitting ? t('editSheet.saving') : t('editSheet.save')}
                    </EcoButton>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
