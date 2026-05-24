import { Label } from 'src/shared/lib/shadcn/components/ui/label'
import { Input } from 'src/shared/lib/shadcn/components/ui/input'
import {
    DAY_LABELS,
    type OperatingScheduleItem,
} from 'src/features/admin/buildings/operatingScheduleUtils'

export const LeafOperatingScheduleFields = ({
    schedules,
    disabled,
    onChange,
}: {
    schedules: OperatingScheduleItem[]
    disabled?: boolean
    onChange: (schedules: OperatingScheduleItem[]) => void
}) => {
    const updateDay = (
        dayOfWeek: number,
        patch: Partial<OperatingScheduleItem>,
    ) => {
        onChange(
            schedules.map((s) =>
                s.dayOfWeek === dayOfWeek ? { ...s, ...patch } : s,
            ),
        )
    }

    return (
        <div className="border-outline-variant flex flex-col gap-3 rounded-lg border p-4">
            <div>
                <p className="text-sm font-medium">요일별 운영시간</p>
                <p className="text-on-surface-variant mt-1 text-xs">
                    조명·에어컨 공통 스케줄입니다. 제보 시각부터 끄는 시간까지
                    방치 시간을 계산합니다.
                </p>
            </div>
            <div className="flex flex-col gap-3">
                {schedules.map((schedule) => (
                    <div
                        key={schedule.dayOfWeek}
                        className="border-outline-variant/60 rounded-md border p-3"
                    >
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">
                                {DAY_LABELS[schedule.dayOfWeek]}요일
                            </span>
                            <label className="text-on-surface-variant flex items-center gap-2 text-xs">
                                <input
                                    type="checkbox"
                                    checked={schedule.closed}
                                    disabled={disabled}
                                    onChange={(e) =>
                                        updateDay(schedule.dayOfWeek, {
                                            closed: e.target.checked,
                                            powerOnTime: e.target.checked
                                                ? undefined
                                                : (schedule.powerOnTime ??
                                                  '07:00'),
                                            powerOffTime: e.target.checked
                                                ? undefined
                                                : (schedule.powerOffTime ??
                                                  '22:00'),
                                        })
                                    }
                                />
                                운영 없음
                            </label>
                        </div>
                        {!schedule.closed && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label
                                        htmlFor={`on-${schedule.dayOfWeek}`}
                                        className="text-xs"
                                    >
                                        켜는 시간
                                    </Label>
                                    <Input
                                        id={`on-${schedule.dayOfWeek}`}
                                        type="time"
                                        value={schedule.powerOnTime ?? ''}
                                        disabled={disabled}
                                        onChange={(e) =>
                                            updateDay(schedule.dayOfWeek, {
                                                powerOnTime: e.target.value,
                                            })
                                        }
                                        className="border-outline-variant bg-surface h-10"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label
                                        htmlFor={`off-${schedule.dayOfWeek}`}
                                        className="text-xs"
                                    >
                                        끄는 시간
                                    </Label>
                                    <Input
                                        id={`off-${schedule.dayOfWeek}`}
                                        type="time"
                                        value={schedule.powerOffTime ?? ''}
                                        disabled={disabled}
                                        onChange={(e) =>
                                            updateDay(schedule.dayOfWeek, {
                                                powerOffTime: e.target.value,
                                            })
                                        }
                                        className="border-outline-variant bg-surface h-10"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
