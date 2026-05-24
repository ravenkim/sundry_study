export type OperatingScheduleItem = {
    dayOfWeek: number
    closed: boolean
    powerOnTime?: string
    powerOffTime?: string
}

export const DAY_LABELS: Record<number, string> = {
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
    7: '일',
}

export function defaultOperatingSchedules(): OperatingScheduleItem[] {
    return [1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) => {
        if (dayOfWeek === 7) {
            return { dayOfWeek, closed: true }
        }
        if (dayOfWeek === 6) {
            return {
                dayOfWeek,
                closed: false,
                powerOnTime: '08:00',
                powerOffTime: '18:00',
            }
        }
        return {
            dayOfWeek,
            closed: false,
            powerOnTime: '07:00',
            powerOffTime: '22:00',
        }
    })
}

export function normalizeOperatingSchedules(
    schedules?: OperatingScheduleItem[] | null,
): OperatingScheduleItem[] {
    if (!schedules || schedules.length === 0) {
        return defaultOperatingSchedules()
    }
    const byDay = new Map(schedules.map((s) => [s.dayOfWeek, s]))
    return [1, 2, 3, 4, 5, 6, 7].map(
        (day) => byDay.get(day) ?? { dayOfWeek: day, closed: day === 7 },
    )
}

export function toApiOperatingSchedules(
    schedules: OperatingScheduleItem[],
): OperatingScheduleItem[] {
    return schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        closed: s.closed,
        powerOnTime: s.closed ? undefined : s.powerOnTime,
        powerOffTime: s.closed ? undefined : s.powerOffTime,
    }))
}
